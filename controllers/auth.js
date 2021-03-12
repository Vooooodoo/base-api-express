const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../db/models');
const config = require('../config');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN, PASSWORD_HASH_SALT } = process.env;
const authErr = new AuthError('Invalid email or password.');

const signUp = async (req, res, next) => {
  try {
    const { name, email, password, dob } = req.body;

    const passwordHash = bcrypt.hashSync(password, Number(PASSWORD_HASH_SALT));
    let userData = await models.User.create({
      name,
      email,
      password: passwordHash,
      dob,
    });
    userData = userData.toJSON();
    delete userData.password;

    res.status(201).send(userData);
  } catch (err) {
    next(err);
  }
}

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await models.User.findOne({
      where: { email },
      attributes: { include: ['password'] }
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
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.send({ token });
  } catch (err) {
    next(err);
  }
}

module.exports = { signUp, signIn };
