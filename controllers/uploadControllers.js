const knex = require('knex')(require('../knexfile'));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const upload = require('../s3Config');

exports.uploadData = async (req, res) => {
    try {

        // Multer middleware
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
        const { firebaseId, photoUrl, videoUrl, description, name } = req.body;
        const [user] = await knex('users').where({ firebase_auth_id: firebaseId });
        
        if (!user) return res.status(404).json({ error: 'User not found' });

        const [id] = await knex('contestants').insert({
            user_id: user.id,
            url_photo: photoUrl,
            url_video: videoUrl,
            description,
            votes: 0
        });

        res.json({ id });
        // Creating a stripe customer
        const customer =await stripe.customers.create({
            email:user.email
        });
        // Creating invoice item
        const invoiceItem = await stripe.invoiceItems.create({
            customer: customer.id,
            amount: 250,
            currency:"cad",
            description:"Contest Entry Fee"
        });

        //Creating invoice for the customer
        const invoice = await stripe.invoices.create({
            customer: customer.id,
            collection_method: "send_invoice"
        });


    });

    } catch (error) {
        res.status(500).json({ error: 'Failed to upload' });
    }
};

exports.getAllContestants = async (req, res) => {
    try {
        const contestants = await knex('contestants').select();
        res.json(contestants);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve contestants' });
    }
};

