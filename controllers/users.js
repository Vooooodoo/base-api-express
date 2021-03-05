const bcrypt = require('bcryptjs'); // модуль для хэширования пароля пользователя
const models = require('../database/models');

const getUsers = (req, res, next) => {
  models.User.findAll({
    raw: true,
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
  })
    .then(data => res.send(data))

    .catch(next);
}

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
    dob,
  } = req.body;

  // хешируем пароль с помощью модуля bcrypt, 10 - это длина «соли»,
  // случайной строки, которую метод добавит к паролю перед хешированием, для безопасности
  bcrypt.hash(password, 10)
    .then(hash => models.User.create({
      name,
      email,
      password: hash, // записали хеш в базу
      dob,
    }))

    .then(data => {
      res.send({
        id: data.id,
        name: data.name,
        email: data.email,
        dob: data.dob,
      }); // вернули объект из базы с записанными в него данными пользователя
    })

    .catch(next);
}

const removeUser = (req, res, next) => {
  models.User.findByPk(req.params.id)
    .then(user => {
      if (!user) {
        throw new Error('Нет пользователя с таким id.');
      }

      models.User.destroy({
        where: {
          id: req.params.id
        }
      })

      .then(() => res.status(200).send('Пользователь успешно удалён.'))
    })

    .catch((err) => {
      res.status(404).send(err.message);
    })

    .catch(next);
}

module.exports = {
  getUsers,
  createUser,
  removeUser
};
