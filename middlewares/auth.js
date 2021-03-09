// мидлвер для того, чтобы пользователь не проходил
// каждый раз аутентификацию (ввод логина и пароля),
// а был автоматически авторизован на сервисе и сразу получил доступ к личному кабинету
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
    // метод verify() принимает два аргумента: токен и секретный ключ,
    // которым этот токен был подписан
    // он возвращает payload, если токен прошёл проверку
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch(err) {
    handleErr(err, req, res);
  }

  // здесь окажется объект payload, который мы передали при создании токена,
  // а именно { id: user.id }, и за счёт миддлвера он окажется в свойстве user
  // всех запросов приложения, так следующий мидлвэр сможет определить,
  // кем этот запрос был выполнен
  req.user = payload;

  next(); // пропускаем запрос дальше
};
