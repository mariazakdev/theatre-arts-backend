const logger = require('../logger');

const errorHandlingMiddleware = (error, req, res, next) => {
  logger.error(error.stack);


  if(res.headersSent){
    return next(error);
  }

  res.status(500).send('Something broke!');
};

module.exports = errorHandlingMiddleware;