// Use environment variables for config settings.
// This is because secrets such as passwords should never be part of the source code
// (and especially not committed to version control).
// для работоспособности использовать .sequelizerc файл,
// в котором можно указать путь до config.js и его новое расширение
require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.PROD_DATABASE_URL,
    dialect: 'postgres',
  },
};
