'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };

  User.init({
    name: {
      // constraint отправит SQL запрос, который вернёт ошибку БД, в случае невалидного поля
      allowNull: false,
      type: DataTypes.STRING,
      // validation даже не даст отправить SQL запрос,
      // в случае невалидного поля, ошибка вернётся на уровне JS
      validate: {
        len: [2, 30],
      }
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        min: 8,
      },
    },
    dob: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      validate: {
        len: [8, 20],
      },
    }
  }, {
    sequelize,
    modelName: 'User',

  });

  return User;
};
