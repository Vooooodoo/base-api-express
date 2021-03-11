const router = require('express').Router();
const authRouter = require('./auth');
const usersRouter = require('./users');
const auth = require('../middlewares/auth');

router.use('/', authRouter);
router.use(auth);
router.use('/users', usersRouter);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден.' });
});

module.exports = router;
