const router = require('express').Router();
const usersRouter = require('./users');

router.use('/users', usersRouter);

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден.' });
});

module.exports = router;
