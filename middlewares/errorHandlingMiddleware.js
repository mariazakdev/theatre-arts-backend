const logger = require('../logger');


const errorHandlingMiddleware = (error, req, res, next) => {
  if (error.name === 'CustomError') {
    res.status(400).json({ error: 'Bad Request: Custom Error' });
  } else {
    logger.error(error.stack);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = errorHandlingMiddleware;

