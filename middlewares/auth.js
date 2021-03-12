const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;
const authErr = new AuthError('Authorization is required.');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw authErr;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw authErr;
  }

  req.user = payload;

  next();

  // try {
  //   const token = (req.headers.authorization || '').replace(/Bearer /, '');

  //   const payload = jwt
  // } catch (err) {

  // }
};
