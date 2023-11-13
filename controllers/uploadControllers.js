const knex = require('knex')(require('../knexfile'));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Configure the S3 client with your AWS credentials and set up earlier in your code
const s3Client = new S3Client({ region: process.env.REGION }); 
const BUCKET_NAME = process.env.S3_BUCKET_NAME; 


exports.newContestant = async (req, res) => {
    try {
        const { firebaseId, photoUrl, videoUrl, description, name } = req.body;

        // Retrieve the user from the database
        const [user] = await knex('users').where({ firebase_auth_id: firebaseId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Insert contestant information into the database
        const [insertedId] = await knex('contestants').insert({
            user_id: user.id,
            name,
            url_photo: photoUrl,
            url_video: videoUrl,
            description,
            votes: 0
        });

        res.status(201).json({
            contestantId: insertedId,
            message: 'Contestant created successfully'
        });
    } catch (error) {
        console.error('Error in newContestant:', error);
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

   
