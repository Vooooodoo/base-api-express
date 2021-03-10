const jwt = require('jsonwebtoken');
const handleErr = require('../errors/errorHandler');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Необходима авторизация.' })
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }

  req.user = payload;

  next();
};
