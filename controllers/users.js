const bcrypt = require('bcryptjs'); // модуль для хэширования пароля пользователя
const jwt = require('jsonwebtoken');
const models = require('../database/models');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  models.User.findAll({
    raw: true,
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
  })
    .then(data => res.send(data))

    .catch(next);
}

const getUser = (req, res, next) => {
  models.User.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
  })
    .then(data => res.send(data))

    .catch(err => {
      throw new NotFoundError(err.message);
    })

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
      throw new ValidationError('Пользователь с таким email уже существует.');
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
  } catch {
    next();
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
        // метод json отправит пользователю json объект
        .then(() => res.status(200).json({ message: 'Пользователь успешно удалён.' }))
    })

    .catch(err => {
      throw new NotFoundError(err.message);
    })

    .catch(next);
}

function setUserInfo(req, res, next) {
  const { name, dob } = req.body;

  models.User.update({ name, dob }, {
    where: {
      id: req.user.id
    }
  })
    .then(data => res.send(data))

    .catch(err => {
      throw new NotFoundError(err.message);
    })

    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  return models.User.findOne({
    where: {
      email: email,
      password: password
    }
  })
    .then(user => {
      const token = jwt.sign(
        { id: user.id }, // пэйлоуд токена
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })

    .catch(err => {
      throw new AuthError(err.message);
    })

    .catch(next);
}


module.exports = {
  getUsers,
  getUser,
  createUser,
  removeUser,
  setUserInfo,
  login,
};
