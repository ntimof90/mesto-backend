const jsonWebToken = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization required');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jsonWebToken.verify(token, JWT_SECRET);
  } catch (e) {
    next(new UnauthorizedError('Access denied'));
  }
  req.user = payload;
  next();
};
