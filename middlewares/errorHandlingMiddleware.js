const logger = require('../logger');

const errorHandlingMiddleware = (error, req, res, next) => {
  logger.error(error.stack);

  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = errorHandlingMiddleware;