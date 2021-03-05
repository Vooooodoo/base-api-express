const router = require('express').Router();
const usersRouter = require('./users');

router.use('/users', usersRouter);

router.use('*', (req, res) => {
  res.status(404).send('Запрашиваемый ресурс не найден.');
});

module.exports = router;
