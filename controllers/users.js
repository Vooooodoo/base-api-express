const bcrypt = require('bcryptjs'); // модуль для хэширования пароля пользователя
const jwt = require('jsonwebtoken');
const models = require('../database/models');
const handleErr = require('../errors/errorHandler');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;
const userNotFoundErr = new NotFoundError('Нет пользователя с таким id.');
const authErr = new AuthError('Неверный email или пароль.');

const getUsers = async (req, res) => {
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
  } catch (err) {
    handleErr(err, req, res);
  }
}

const getUser = async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });

    if (!user) {
      // объект новой ошибки прилетит в качестве аргумента catch(err)
      throw new NotFoundError('Нет пользователя с таким id.');
    }

    res.send(user);
  } catch(err) {
    handleErr(err, req, res);
  }
}

const createUser = async (req, res) => {
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

    res.status(201).send({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      dob: userData.dob,
    }); // вернули объект из базы с записанными в него данными пользователя
  } catch(err) {
    handleErr(err, req, res);
  }
}

const removeUser = async (req, res) => {
  try {
    const user = await models.User.findByPk(req.params.id);

    if (!user) {
      throw userNotFoundErr;
    }

    await models.User.destroy({
      where: {
        id: req.params.id
      }
    });

    // метод json отправит пользователю json объект
    res.status(200).json({ message: 'Пользователь успешно удалён.' });
  } catch(err) {
    handleErr(err, req, res);
  }
}

const setUserInfo = async (req, res) => {
  try {
    const { name, dob } = req.body;

    // при успешной авторизации в объекте запроса появится свойство user,
    // в которое запишется payload токена, его можно использовать в обработчиках
    const user = await models.User.update({ name, dob }, {
      where: {
        id: req.user.id,
      }
    });

    if (!user) {
      throw userNotFoundErr;
    }

    res.status(200).json({ message: 'Пользователь успешно обновлён.' });
  } catch {
    handleErr(err, req, res);
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await models.User.findOne({
      where: {
        email: email,
      }
    });
    if (!user) {
      throw authErr;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw authErr;
    }

    const token = jwt.sign(
      // payload токена содержит информацию, которую мы будем кодировать
      // по нему, в случае успешной авторизации,
      // будем аутентифицировать новые запросы пользователя
      { id: user.id },
      // node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
      // такое выражение сгенерирует 256-битный (32-байтный)
      // криптостойкий и псевдослучайный ключ и выведет его в консоль
      // результат нужно использовать в качестве JWT_SECRET
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );

    res.send({ token });
  } catch(err) {
    handleErr(err, req, res);
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
