// dotenv is a module that loads environment variables
// from a .env file into process.env
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');

const { PORT } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', usersRouter);

app.use('*', (req, res) => {
  res.status(404).send('Запрашиваемый ресурс не найден.');
});

app.use(errors()); // обработчик ошибок валидации до запуска контроллера celebrate

// централизованная обработка ошибок
app.use((error, req, res, next) => {
  // если ошибка сгенерирована не нами - выставляем статус 500
  const { statusCode = 500, message } = error;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}: http://localhost:7000`);
});
