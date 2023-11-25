// stripeWebhookHandler.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const knex = require('knex')(require('./knexfile'));

router.post('/stripe-webhook', bodyParser.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Example: Add logic to handle successful checkout session
        // You need to implement the logic to convert session details to votes
        // This might involve extracting an actor ID and the amount from the session
        const actorId = session.client_reference_id;
        const votes = session.amount_total / 100; // Assuming $1 = 1 vote

        try {
            await knex('contestants')
                .where('id', actorId)
                .increment('votes', votes);

            res.status(200).json({ received: true });
        } catch (error) {
            console.error('Error updating votes:', error);
            res.status(500).send('Error in processing the vote');
        }
    } else {
        // Handle other event types
        console.log(`Unhandled event type ${event.type}`);
        res.status(200).json({ received: true });
    }
});

module.exports = router;
