const { verifyToken } = require('../utils/token');
const AuthError = require('../errors/AuthError');

const authErr = new AuthError('Authorization is required.');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw authErr;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = verifyToken(token);
  } catch (err) {
    throw authErr;
  }

  req.user = payload;

  next();
};
