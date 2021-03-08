const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;
const userAuthErr = new AuthError('Необходима авторизация.');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw userAuthErr;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch(err) { //! проверить работоспособность без объекта err
    throw userAuthErr;
  }

  // здесь окажется объект payload, которым мы подписали токен,
  // а именно { id: user.id }, и за счёт миддлвера он окажется в свойстве user
  // всех запросов приложения, так можно идентифицировать запросы конкретного пользователя
  req.user = payload;

  next();
};
