const jwt = require('jsonwebtoken');
const config = require('../config');
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
    payload = jwt.verify(
      token,
      `${config.nodeEnv === 'production' ? config.jwt.secret : 'dev-secret'}`
    );
  } catch (err) {
    throw authErr;
  }

  req.user = payload;

  next();
};
