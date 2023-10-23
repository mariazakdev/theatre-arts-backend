const stripeSecretKey = process.env.STRIPE_SECRET_KEY; 
const stripe = require("stripe")(stripeSecretKey);

exports.handlePayment = async (req, res) => {
    try {
        const { stripeToken, email } = req.body;

        const customer = await stripe.customers.create({
            email,
            source: stripeToken
        });

        const charge = await stripe.charges.create({
            amount: 250, // in cents
            currency: "cad",
            customer: customer.id,
            description: "Contest Entry Fee"
        });

        if (charge.paid) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Charge failed' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
