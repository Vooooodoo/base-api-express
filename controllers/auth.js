const models = require('../db/models');
const { generatePassHash, comparePasswords } = require('../utils/passwordHash');
const { createToken } = require('../utils/token');
const AuthError = require('../errors/AuthError');
const ValidationError = require('../errors/ValidationError');

const authErr = new AuthError('Invalid email or password.');

const signUp = async (req, res, next) => {
  try {
    const { name, email, password, dob } = req.body;
    const user = await models.User.findOne({ where: { email } });

    if (user) {
      throw new ValidationError('A user with this email already exists.');
    }

    const passwordHash = generatePassHash(password);
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

    const isMatch = comparePasswords(password, user.password);
    if (!isMatch) {
      throw authErr;
    }

    const token = createToken(user.id);

    res.send({ token });
  } catch (err) {
    next(err);
  }
}

module.exports = { signUp, signIn };
