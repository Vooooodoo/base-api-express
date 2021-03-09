const router = require('express').Router();
const usersRouter = require('./users');
const auth = require('../middlewares/auth');
const { validateNewUser, validateLogin } = require('../middlewares/reqValidation');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');

// роуты, которым не требуется авторизация
router.post('/signup', validateNewUser, createUser);
router.post('/signin', validateLogin, login);

// всё что ниже мидлвера auth получит доступ к объекту req.user
// в котором хранится payload jwt токена, доступные через req.user
// router.use(auth);

// защищённые роуты, которым требуется авторизация
router.use('/users', usersRouter);

router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден.');
});

module.exports = router;
