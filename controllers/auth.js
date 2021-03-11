const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../database/models');
const handleErr = require('../errors/errorHandler');
const ValidationError = require('../errors/ValidationError');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, SALT, JWT_SECRET } = process.env;
const authErr = new AuthError('Неверный email или пароль.');

const createUser = async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;
    const user = await models.User.findOne({ where: { email } });

    if (user) {
      throw new ValidationError('Пользователь с таким email уже существует.');
    }

    const passwordHash = bcrypt.hashSync(password, SALT);
    let userData = await models.User.create({
      name,
      email,
      password: passwordHash,
      dob,
    });
    userData = userData.toJSON();
    delete userData.password;

    res.status(201).send({
      user: userData,
      token: ''
    });
  } catch (err) {
    if (err.name === 'SequelizeDatabaseError') {
      return res.status(400).json({ message: err.message });
    }
    handleErr(err, req, res);
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await models.User.findOne({ where: { email } });
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
