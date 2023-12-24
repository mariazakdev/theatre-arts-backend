const knex = require('knex')(require('../knexfile'));
const stripeSecretKey = process.env.STRIPE_SECRET_KEY; 
const stripe = require("stripe")(stripeSecretKey);


  
  exports.paidVotes = async (req, res, next) => {
    const actorId = req.params.actorId;
  
    try {
      const { stripeToken, email, userId, voteCount } = req.body;
      const votePrice = 100; // Example: each vote costs $1
      
      const customer = await stripe.customers.create({
        email: email,
        source: stripeToken
      });
  
      // Create a charge for the customer
      const charge = await stripe.charges.create({
        amount: votePrice * voteCount,
        currency: "cad",
        customer: customer.id,
        description: "Payment for Votes"
      });
  
      if (charge.paid) {
        // Record the successful payment and the votes purchased
        await knex('paid_votes').insert({
          user_id: userId,
          payment_intent_id: charge.id,
          amount: charge.amount / 100, // Convert to dollars
          votes: voteCount
        });
  
        res.json({ success: true, message: 'Payment and votes recorded' });
  
        // Call the common function to update votes
        await updateVotes(actorId, voteCount);
  
        res.status(200).json({ message: 'Payment processed successfully, votes pending recording' });
    } else {
        res.status(402).json({ error: 'Payment required' });
      }
    } catch (error) {
     next(error);
    }
  };
  