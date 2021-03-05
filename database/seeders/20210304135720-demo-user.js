// файл автоматически создался с помощью утилиты sequelize-cli
// с помощью сидеров можно быстро заполнить БД прямо из файла
'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: '1',
        email: '1@1.ru',
        password: bcrypt.hashSync('111', 10),
        dob: '01.01.1991',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '2',
        email: '2@2.ru',
        password: bcrypt.hashSync('222', 10),
        dob: '02.02.1992',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '3',
        email: '3@3.ru',
        password: bcrypt.hashSync('333', 10),
        dob: '03.03.1993',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};