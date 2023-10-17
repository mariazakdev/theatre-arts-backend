require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const knex = require('knex')(require('./knexfile'));

const port = process.env.PORT || 3000; 

const app = express();

const UploadRoute = require('./routes/uploadRoutes');
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/upload', UploadRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
