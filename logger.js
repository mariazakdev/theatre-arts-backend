const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),  // Log messages to the console
    new winston.transports.File({ filename: 'error.log' }),  // Log messages to a file named 'error.log'
  ],
  format: winston.format.simple(),  // Use a simple log format for human readability
});

module.exports = logger;