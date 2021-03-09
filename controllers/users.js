const bcrypt = require('bcryptjs');
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
    const allUsers = await models.User.findAll({
      raw: true,
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });

    res.send(allUsers);
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
      throw new NotFoundError('Нет пользователя с таким id.');
    }

    res.send(user);
  } catch (err) {
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

    const passwordHash = bcrypt.hashSync(password, 10);
    const userData = await models.User.create({
      name,
      email,
      password: passwordHash,
      dob,
    });

    res.status(201).send({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      dob: userData.dob,
    });
  } catch (err) {
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

    res.status(200).json({ message: 'Пользователь успешно удалён.' });
  } catch (err) {
    handleErr(err, req, res);
  }
}

const setUserInfo = async (req, res) => {
  try {
    const { name, dob } = req.body;

    const user = await models.User.update({ name, dob }, {
      where: {
        id: req.user.id,
      }
    });

    if (!user) {
      throw userNotFoundErr;
    }

    res.status(200).json({ message: 'Пользователь успешно обновлён.' });
  } catch (err) {
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
      { id: user.id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );

    res.send({ token });
  } catch (err) {
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
