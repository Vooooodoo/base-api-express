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

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      dob,
    } = req.body;
    const user = await models.User.findOne({ where: { email: email } });

    if (user) {
      throw new Error('Пользователь с таким email уже существует.');
    }

    // запишем хеш пароля в константу с помощью модуля bcrypt в синхронном режиме,
    // 10 - это длина «соли», случайной строки,
    // которую метод добавит к паролю перед хешированием, для безопасности
    const passwordHash = bcrypt.hashSync(password, 10);
    const userData = await models.User.create({
      name,
      email,
      password: passwordHash, // записали хеш в базу
      dob,
    })

    res.send({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      dob: userData.dob,
    }); // вернули объект из базы с записанными в него данными пользователя
  } catch (err) {
    res.status(400).json({ message: err.message }); // вернули пользователю json с ошибкой
  }
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

        .then(() => res.status(200).json({ message: 'Пользователь успешно удалён.' }))
    })

    .catch((err) => {
      res.status(404).json({ message: err.message });
    })

    .catch(next);
}

module.exports = {
  getUsers,
  createUser,
  removeUser
};
