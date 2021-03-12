'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: '1',
        email: '1@1.ru',
        password: bcrypt.hashSync('11111111', 10),
        dob: new Date('1991-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '2',
        email: '2@2.ru',
        password: bcrypt.hashSync('22222222', 10),
        dob: new Date('1992-02-02'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '3',
        email: '3@3.ru',
        password: bcrypt.hashSync('33333333', 10),
        dob: new Date('1993-03-03'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
