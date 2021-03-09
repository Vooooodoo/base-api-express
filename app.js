// dotenv is a module that loads environment variables
// from a .env file into process.env
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const routes = require('./routes');

const { PORT } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

app.use(errors()); // обработчик ошибок валидации до запуска контроллера

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}: http://localhost:7000`);
});
