const router = require('express').Router();
const usersRouter = require('./users');
const { validateNewUser, validateLogin } = require('../middlewares/reqValidation');
const { createUser, login } = require('../controllers/users');

router.post('/signup', validateNewUser, createUser);
router.post('/signin', validateLogin, login);

router.use('/users', usersRouter);

router.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден.' });
});

module.exports = router;
