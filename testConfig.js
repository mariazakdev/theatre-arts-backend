// config.js

require('dotenv').config();

const config = {
  development: {
    port: process.env.PORT || 8000,
    // Other development configuration options
  },
  test: {
    port: 5000, // Use a different port for testing
    // Other testing configuration options
  },
  production: {
    port: process.env.PORT || 8000,
    // Other production configuration options
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];
