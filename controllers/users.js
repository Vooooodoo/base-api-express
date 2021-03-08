const bcrypt = require('bcryptjs'); // модуль для хэширования пароля пользователя
const jwt = require('jsonwebtoken');
const models = require('../database/models');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;
const userNotFoundErr = new NotFoundError('Нет пользователя с таким id.');

const getUsers = async (req, res, next) => {
  try {
    // ключевое слово await заставит интерпретатор ждать до тех пор,
    // пока промис справа от await не выполнится,
    // после чего оно вернёт его результат, и выполнение кода продолжится
    const allUsers = await models.User.findAll({
      raw: true,
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });

    res.send(allUsers);
    // в случае ошибки выполнение try прерывается,
    // создаётся новый экземпляр класса Error и управление переходит в начало блока catch
  } catch {
    next();
  }
}

const getUser = async (req, res, next) => {
  try {
    const user = await models.User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });

    if (!user) {
      throw userNotFoundErr;
    }

    res.send(user);
  } catch {
    next();
  }
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
    });

    res.send({ //! проверить успешный статус, должен быть 201
      id: userData.id,
      name: userData.name,
      email: userData.email,
      dob: userData.dob,
    }); // вернули объект из базы с записанными в него данными пользователя
  } catch {
    next();
  }
}

const removeUser = async (req, res, next) => {
  try {
    const user = await models.User.findByPk(req.params.id);

    if (!user) {
      throw userNotFoundErr;
    }

    await models.User.destroy({ //! проверить такую конструкцию без константы
      where: {
        id: req.params.id
      }
    });

    // метод json отправит пользователю json объект
    res.status(200).json({ message: 'Пользователь успешно удалён.' });
  } catch {
    next();
  }
}

const setUserInfo = async (req, res, next) => {
  try {
    const { name, dob } = req.body;

    const user = await models.User.update({ name, dob }, {
      where: {
        id: req.user.id
      }
    });

    if (!user) {
      throw userNotFoundErr;
    }

    res.send(user);
  } catch {
    next();
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await models.User.findOne({
      where: {
        email: email,
        password: password,
      }
    });

    if (!user) {
      throw new AuthError('Неверный email или пароль.');
    }

    const token = jwt.sign(
      // payload токена, по которому в случае успешной авторизации,
      // будем идентифицировать новые запросы пользователя
      { id: user.id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );

    res.send({ token });
  } catch {
    next();
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  removeUser,
  setUserInfo,
  login,
};
