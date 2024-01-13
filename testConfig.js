
require('dotenv').config();

const config = {
  development: {
    port: process.env.PORT || 8000,
  },
  test: {
    port: 5000, 
  },
  production: {
    port: process.env.PORT || 8000,
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];
