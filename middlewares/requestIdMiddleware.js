const uuid = require('uuid').v4;

const requestIdMiddleware = (req, res, next) => {
  req.id = uuid();
  next();
};  

module.exports = requestIdMiddleware;