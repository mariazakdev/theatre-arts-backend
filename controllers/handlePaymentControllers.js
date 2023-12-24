const stripeSecretKey = process.env.STRIPE_SECRET_KEY; 
const stripe = require("stripe")(stripeSecretKey);



exports.payment = async (req, res, next) => {
    try {
      const { paymentMethod, email } = req.body;
  
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 250,
        currency: 'cad',
        payment_method: paymentMethod,
        // confirmation_method: 'manual',
        // confirm: true,
        description: 'Contest Entry Fee',
        customer_email: email,
        // return_url: 'http://localhost:3000/contestant/payment-success',
        automatic_payment_methods: {
          enabled: true,
        },
      });
  
      // If successful, you can customize the response as needed
      res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
     next(error);
    }
  };























// exports.payment = async (req, res) => {
//     try {
//         const { stripeToken, email } = req.body;

//         const customer = await stripe.customers.create({
//             email,
//             source: stripeToken
//         });

//         const charge = await stripe.charges.create({
//             amount: 250, // in cents
//             currency: "cad",
//             customer: customer.id,
//             description: "Contest Entry Fee"
//         });

//         if (charge.paid) {
//             res.json({ success: true });
//         } else {
//             res.status(500).json({ error: 'Charge failed' });
//         }

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };