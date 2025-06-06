const stripeSecretKey = process.env.STRIPE_SECRET_KEY; 
const stripe = require("stripe")(stripeSecretKey);
const logger = require("../logger");


exports.payment = async (req, res, next) => {
    try {
      const { paymentMethod, email } = req.body;
  
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 250,
        currency: 'cad',
        payment_method: paymentMethod,
        description: 'Contest Entry Fee',
        customer_email: email,
        automatic_payment_methods: {
          enabled: true,
        },
      });

  
      res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
      if (error.type === "StripeCardError") {
        logger.error(`StripeCardError: ${error.message}`, { stack: error.stack });
        return res.status(400).json({ error: error.message });
      } else if (error.type === "StripeInvalidRequestError") {
        logger.error(`StripeInvalidRequestError: ${error.message}`, { stack: error.stack });
        return res.status(400).json({ error: error.message });
      } else if (error.type === "StripeAPIError") {
        logger.error(`StripeAPIError: ${error.message}`, { stack: error.stack });
        return res.status(400).json({ error: error.message });
      } else if (error.type === "StripeConnectionError") {
        logger.error(`StripeConnectionError: ${error.message}`, { stack: error.stack });
        return res.status(400).json({ error: error.message });
      } else if (error.type === "StripeAuthenticationError") {
        logger.error(`StripeAuthenticationError: ${error.message}`, { stack: error.stack });
        return res.status(400).json({ error: error.message });
      } else if (error.type === "StripeRateLimitError") {
        logger.error(`StripeRateLimitError: ${error.message}`, { stack: error.stack });
        return res.status(400).json({ error: error.message });
      } else {
        logger.error(`Unhandled error processing payment: ${error.message}`, { stack: error.stack });
        res.status(500).json({ error: "Internal Server Error" });
        next(error);
      }
    }
  }