const knex = require("knex")(require("../knexfile"));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const upload = require("../s3Config");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({ region: process.env.REGION });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Handle file upload and contestant creation
exports.uploadData = async (req, res) => {
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Extract data from the request body
      const { firebaseId, photoUrl, videoUrl, description, name, stripeToken } = req.body;
      const [user] = await knex("users").where({
        firebase_auth_id: firebaseId,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.is_contestant) {
        return res.status(403).json({ error: "User is not a contestant" });
      }

      // Proceed to insert contestant information into the database
      const [id] = await knex("contestants")
        .insert({
          user_id: user.id,
          name,
          url_photo: photoUrl,
          url_video: videoUrl,
          description,
          votes: 0,
        })
        .returning("id");

      // Create a Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        source: stripeToken
      });

      // Charge the customer
      const charge = await stripe.charges.create({
        amount: 25000, // Amount is in cents, so 250.00 CAD
        currency: "cad",
        customer: customer.id,
        description: "Contest Entry Fee"
      });

      // Check if the charge was successful
      if (charge.status !== 'succeeded') {
        return res.status(500).json({ error: 'Charge failed' });
      }

      // Respond with the contestant ID and success message
      res.status(201).json({
        contestantId: id,
        message: "Contestant created and payment was successful"
      });
    });
  } catch (error) {
    console.error("Error in uploadData: ", error);
    res.status(500).json({ error: "Failed to upload contestant data" });
  }
};


// Retrieve all contestants with their signed photo URLs
exports.getAllContestants = async (req, res) => {
  try {
    const contestants = await knex("contestants").select("*");
    for (const contestant of contestants) {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: contestant.url_photo,
      });
      contestant.signedPhotoUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 900,
      });
    }
    res.json(contestants);
  } catch (error) {
    console.error("Error retrieving contestants: ", error);
    res.status(500).json({ error: "Failed to retrieve contestants" });
  }
};

exports.getContestantById = (req, res) => {};
