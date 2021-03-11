const router = require('express').Router();
const usersRouter = require('./users');
const auth = require('../middlewares/auth');

const { validateNewUser, validateLogin } = require('../middlewares/reqValidation');
const { createUser, login } = require('../controllers/auth');

router.post('/sign-up', validateNewUser, createUser);
router.post('/sign-in', validateLogin, login);

router.use(auth);

router.use('/users', usersRouter);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден.' });
});

module.exports = router;
