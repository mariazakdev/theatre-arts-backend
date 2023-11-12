const knex = require('knex')(require('../knexfile'));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Configure the S3 client with your AWS credentials and set up earlier in your code
const s3Client = new S3Client({ region: process.env.REGION }); 
const BUCKET_NAME = process.env.S3_BUCKET_NAME; 

// Handle contestant creation with URLs for photo and video already uploaded to S3
exports.newContestant = async (req, res) => {
    try {
        // Extract data from the request body
        const { firebaseId, photoUrl, videoUrl, description, name, stripeToken } = req.body;
        console.log("Received firebaseId:", firebaseId);

        const [user] = await knex('users').where({ firebase_auth_id: firebaseId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.is_contestant) {
            return res.status(403).json({ error: 'User is not a contestant' });
        }

        // Process the payment first
        try { const charge = await stripe.charges.create({
            amount: 250, 
            currency: "cad",
            description: "Contest Entry Fee",
            source: stripeToken,
            receipt_email: user.email
        });
    }catch (error) {
        console.error('Stripe error:', error);
        // Return or handle the error
    }
        // Verify if the charge was successful
        if (charge.status !== 'succeeded') {
            return res.status(402).json({ error: 'Payment failed' });
        }

        // Proceed to insert contestant information into the database
        const [insertedId] = await knex('contestants').insert({
            user_id: user.id,
            name,
            url_photo: photoUrl,
            url_video: videoUrl,
            description,
            votes: 0
        });

        // Respond with the contestant ID, payment receipt, and success message
        res.status(201).json({
            contestantId: insertedId,
            receiptUrl: charge.receipt_url,
            message: 'Payment successful and contestant created'
        });
    } catch (error) {
        console.error('Error in newContestant: ', error);
        res.status(500).json({ error: 'Failed to create contestant' });
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

   
