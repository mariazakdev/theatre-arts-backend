const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),  
    new winston.transports.File({ filename: 'error.log' }),  
  ],
  format: winston.format.simple(),  
});

module.exports = logger;