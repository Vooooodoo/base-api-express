const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../db/models');
const AuthError = require('../errors/AuthError');
const ValidationError = require('../errors/ValidationError');

const { NODE_ENV, SALT, JWT_SECRET } = process.env;
const authErr = new AuthError('Invalid email or password.');

const checkPassword = (pass) => {
  if (!pass || !pass.trim() || pass.length < 8) {
    throw new ValidationError('Invalid password.');
  }
}

const signUp = async (req, res, next) => {
  try {
    const { name, email, password, dob } = req.body;

    checkPassword(password);

    const passwordHash = bcrypt.hashSync(password, Number(SALT));
    let userData = await models.User.create({
      name,
      email,
      password: passwordHash,
      dob,
    });
    userData = userData.toJSON(); //! почему не JSON.stringify()?
    delete userData.password;

    res.status(201).send({
      user: userData,
      token: '' //! зачем здесь токен передавать, ведь мы его передаём на этапе signIn?
    });
  } catch (err) {
    if (
      err.name === 'SequelizeDatabaseError' || //!
      err.name === 'SequelizeUniqueConstraintError' ||
      err.name === 'SequelizeValidationError'
    ) {
      throw new ValidationError(err.message);
      //! return res.status(400).json({ message: err.message });
    }

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
      { expiresIn: '7d' },
    );

    res.send({ token });
  } catch (err) {
    next(err);
  }
}

module.exports = { signUp, signIn };
