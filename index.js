require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const knex = require('knex')(require('./knexfile'));
const errorMiddleware = require('./middlewares/errorHandlingMiddleware');

const port = process.env.PORT || 3000; 
const URL = process.env.CORS_ORIGIN;
const app = express();
app.use(errorMiddleware);

app.use(express.static('public'));

const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const usersFBRoutes = require('./routes/usersFirabaseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const paymentVotes = require('./routes/paymentVotesRoutes');

app.use(
  cors({
    origin: URL,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/users', usersFBRoutes);
app.use('/upload', uploadRoutes);
app.use('/payment', paymentRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/votes', paymentVotes);
app.get('/test-error', (req, res, next) => {

  next(new Error('Test error'));
  
});



app.post('/create-payment-intent', async (req, res) => {
  try {
    const intent = await stripe.paymentIntents.create({
      amount: 250,
      currency: 'cad',
      description: 'Contest Entry Fee',
      payment_method_data: {
        type: 'card',
        card: {
          token: req.body.token,
        },
      },
      confirmation_method: 'manual',
      confirm: true,
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
