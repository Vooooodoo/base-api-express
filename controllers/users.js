const models = require('../db/models');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const userNotFoundErr = new NotFoundError('There is no user with this id.');

module.exports.getUsers = async (req, res, next) => {
  try {
    const allUsers = await models.User.findAll({
      raw: true,
    });

    res.send(allUsers);
  } catch (err) {
    next(err);
  }
}

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await models.User.findOne({
      where: { id: req.params.id },
    });

    if (!user) {
      throw userNotFoundErr;
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

module.exports.removeUser = async (req, res, next) => {
  try {
    const user = await models.User.findByPk(req.params.id);

    if (!user) {
      throw userNotFoundErr;
    }

    await models.User.destroy({ where: { id: req.params.id } });

    res.status(200).json({ message: 'The user was successfully deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const { name, email, dob } = req.body;

    const user = await models.User.update({ name, email, dob }, {
      where: {
        id: req.params.id,
      }
    });

    if (!user) {
      throw userNotFoundErr;
    }

    res.status(200).json({ message: 'The user was successfully updated.' });
  } catch (err) {
    if (
      err.name === 'SequelizeDatabaseError' ||
      err.name === 'SequelizeUniqueConstraintError' ||
      err.name === 'SequelizeValidationError'
    ) {
      // throw new ValidationError(err.message);
      return res.status(400).json({ message: err.message });
    }

    next(err);
  }
}
