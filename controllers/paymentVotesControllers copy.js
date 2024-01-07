const knex = require("knex")(require("../knexfile"));
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

const { validationResult } = require("express-validator");

exports.paidVotes = async (req, res, next) => {
  const actorId = req.params.actorId;

  try {
    const transaction = await knex.transaction();

    const { stripeToken, email, userId, voteCount } = req.body;
    const votePrice = 100; // Example: each vote costs $1

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer = await stripe.customers.create({
      email: email,
      source: stripeToken,
    });

    // Create a charge for the customer
    const charge = await stripe.charges.create({
      amount: votePrice * voteCount,
      currency: "cad",
      customer: customer.id,
      description: "Payment for Votes",
    });

    if (charge.paid) {
      // Record the successful payment and the votes purchased
      await knex("paid_votes").insert({
        user_id: userId,
        payment_intent_id: charge.id,
        amount: charge.amount / 100, // Convert to dollars
        votes: voteCount,
      });

      res.json({ success: true, message: "Payment and votes recorded" });

      // Call the common function to update votes
      await updateVotes(actorId, voteCount);

      // Commit the transaction if everything is successful
      await transaction.commit();
      res
        .status(200)
        .json({
          message: "Payment processed successfully, votes pending recording",
        });
    } else {
      res.status(402).json({ error: "Payment required" });
    }
  } catch (error) {
    await transaction.rollback();

    logger.error(`Error in paidVotes: ${error.message}`, {
      stack: error.stack,
      userId,
      actorId,
      voteCount,
    });
    next(error);
  }
};
