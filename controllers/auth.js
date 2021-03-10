const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../database/models');
const handleErr = require('../errors/errorHandler');
const ValidationError = require('../errors/ValidationError');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;
const authErr = new AuthError('Неверный email или пароль.');

const createUser = async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;
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
    if (err.name === 'SequelizeDatabaseError') {
      res.status(400).json({ message: err.message });
    } else {
      handleErr(err, req, res);
    }
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await models.User.findOne({ where: { email: email } });
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

module.exports = { createUser, login };
