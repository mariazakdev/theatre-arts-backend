const knex = require('knex')(require('../knexfile'));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const multer = require('multer');
// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Configure the S3 client with your AWS credentials and set up earlier in your code
const s3Client = new S3Client({ region: process.env.REGION }); 
const BUCKET_NAME = process.env.S3_BUCKET_NAME; 

// Handle contestant creation with URLs for photo and video already uploaded to S3
exports.uploadData = async (req, res) => {
    try {
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Extract data from the request body
            const { firebaseId, photoUrl, videoUrl, description, name } = req.body;
            const [user] = await knex('users').where({ firebase_auth_id: firebaseId });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!user.is_contestant) {
                return res.status(403).json({ error: 'User is not a contestant' });
            }

            // Proceed to insert contestant information into the database
            await knex('contestants').insert({
                user_id: user.id,
                name,
                url_photo: photoUrl,
                url_video: videoUrl,
                description,
                votes: 0
            });

            // Retrieve the inserted contestant data
            const insertedContestant = await knex('contestants')
                .where({ user_id: user.id, name: name })
                .first();

            if (!insertedContestant) {
                return res.status(404).json({ error: 'Failed to retrieve inserted contestant' });
            }
   

        // Create a Stripe customer and invoice after successfully adding a contestant
        const customer = await stripe.customers.create({
            email: user.email
        });

        // Create invoice item for the entry fee
        await stripe.invoiceItems.create({
            customer: customer.id,
            amount: 25000, // 250.00 CAD in cents
            currency: "cad",
            description: "Contest Entry Fee"
        });

        // Create an invoice with the invoice items
        await stripe.invoices.create({
            customer: customer.id,
            collection_method: "send_invoice",
            auto_advance: true // Automatically finalize the invoice
        });

        // Respond with the contestant ID and success message
        res.status(201).json({ contestantId: insertedContestant.id, message: 'Contestant created and invoice sent successfully' });
    });
} catch (error) {
    console.error('Error in uploadData: ', error);
    res.status(500).json({ error: 'Failed to upload contestant data' });
}
};


// Retrieve all contestants with their signed photo URLs
exports.getAllContestants = async (req, res) => {
    try {
        const contestants = await knex('contestants').select('*');
        console.log('Contestants:', contestants); // Check what you get from the DB

        for (const contestant of contestants) {
            const command = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: contestant.url_photo
            });
            contestant.signedPhotoUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
        }
        
        res.json(contestants);
    } catch (error) {
        console.error('Error retrieving contestants: ', error);
        res.status(500).json({ error: 'Failed to retrieve contestants' });
    }
};

   
