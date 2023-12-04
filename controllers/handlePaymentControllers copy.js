const knex = require('knex')(require('../knexfile'));
const stripeSecretKey = process.env.STRIPE_SECRET_KEY; 
const stripe = require("stripe")(stripeSecretKey);

exports.payment = async (req, res) => {
  try {
    const { stripeToken, email, userId } = req.body;
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
      await insertPaymentIntoDatabase(userId, charge.id, charge.amount / 100);

      res.json({ success: true, message: 'Payment successful and recorded' });
    } else {
      res.status(402).json({ error: 'Payment required' });
    }
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function insertPaymentIntoDatabase(userId, paymentIntentId, amount) {
  try {
    // Use transactions for atomicity if necessary
    await knex.transaction(async (trx) => {
      await trx('stripe_payments').insert({
        user_id: userId,
        payment_intent_id: paymentIntentId,
        amount: amount
      });
    });
  } catch (error) {
    console.error('Error inserting into database:', error);
    throw new Error('Error inserting into the database');
  }
}
