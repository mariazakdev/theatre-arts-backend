const logger = require('../logger');

const errorHandlingMiddleware = (error, req, res, next) => {
  logger.error(error.stack);

  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = errorHandlingMiddleware;

// const logger = require('../logger');

// const errorHandlingMiddleware = (error, req, res, next) => {
//   // Log relevant information without circular references
//   logger.error({
//     message: error.message,
//     stack: error.stack,
//     status: res.statusCode,
//     headers: {
//       'access-control-allow-credentials': res.getHeader('access-control-allow-credentials'),
//       'access-control-allow-origin': res.getHeader('access-control-allow-origin'),
//       'content-length': res.getHeader('content-length'),
//       // Add other relevant headers as needed
//     },
//   });

//   if (!res.headersSent) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// module.exports = errorHandlingMiddleware;

