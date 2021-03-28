const jwt = require('jsonwebtoken');
const config = require('../config');

const createToken = userId => jwt.sign(
  { id: userId },
  config.nodeEnv === 'production' ? config.jwt.secret : 'dev-secret',
  { expiresIn: config.jwt.expiresIn },
);

const verifyToken = token => jwt.verify(
  token,
  `${config.nodeEnv === 'production' ? config.jwt.secret : 'dev-secret'}`
);

module.exports = { createToken, verifyToken };
