const router = require('express').Router();
const usersRouter = require('./users');
const auth = require('../middlewares/auth');
const { validateNewUser, validateLogin } = require('../middlewares/reqValidation');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validateNewUser, createUser);
router.post('/signin', validateLogin, login);

// всё что ниже мидлвера auth получит доступ к объекту req.user
// в котором хранится payload jwt токена
router.use(auth);

router.use('/users', usersRouter);

router.use('*', (req, res) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден.');
});

module.exports = router;
