require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const knex = require('knex')(require('./knexfile'));

const port = process.env.PORT || 3000; 
const URL = process.env.CORS_ORIGIN;
const app = express();


app.use(express.static('public'));
const uploadRoute = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/handlePaymentRoutes');
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

app.use('/upload', uploadRoute);
app.use('/payment', paymentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
