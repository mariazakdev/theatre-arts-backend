const logger = require('../logger');

const createCustomError = (message) => {
  const customError = new Error(message);
  customError.name = 'CustomError';
  return customError;
};
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

// const errorHandlingMiddleware = (error, req, res, next) => {
//   if (error instanceof CustomError) {
//     res.status(400).json({ error: 'Bad Request: Custom Error' });
//   } else {
//     logger.error(error.stack);
//     if (!res.headersSent) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }
// };

//  module.exports = errorHandlingMiddleware;

