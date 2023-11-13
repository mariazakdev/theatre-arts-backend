const knex = require('knex')(require('../knexfile'));
const stripeSecretKey = process.env.STRIPE_SECRET_KEY; 
const stripe = require("stripe")(stripeSecretKey);

// ...existing imports and initialization

exports.payment = async (req, res) => {
    try {
        const { stripeToken, email, userId } = req.body;

        // Create a new customer in Stripe
        const customer = await stripe.customers.create({
            email: email,
            source: stripeToken
        });

        // Create a charge for the customer
        const charge = await stripe.charges.create({
            amount: 250, // Amount in cents
            currency: "cad",
            customer: customer.id,
            description: "Contest Entry Fee"
        });

        if (charge.paid) {
            // Record the successful payment
            await knex('stripe_payments').insert({
                user_id: userId,
                payment_intent_id: charge.id,
                amount: charge.amount / 100 // Convert to dollars
            });

            res.json({ success: true, message: 'Payment successful and recorded' });
        } else {
            res.status(402).json({ error: 'Payment required' });
        }
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
