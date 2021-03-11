const models = require('../db/models');
const handleErr = require('../errors/errorHandler');
const NotFoundError = require('../errors/NotFoundError');

const userNotFoundErr = new NotFoundError('There is no user with this id.');

module.exports.getUsers = async (req, res, next) => {
  try {
    const allUsers = await models.User.findAll({
      raw: true,
      attributes: { exclude: ['password'] },
    });

    res.send(allUsers);
  } catch (err) {
    handleErr(err, req, res);
    next(err)
  }
}

module.exports.getUser = async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw userNotFoundErr;
    }

    res.send(user);
  } catch (err) {
    handleErr(err, req, res);
  }
}

module.exports.removeUser = async (req, res) => {
  try {
    const user = await models.User.findByPk(req.params.id);

    if (!user) {
      throw userNotFoundErr;
    }

    await models.User.destroy({ where: { id: req.params.id } });

    res.status(200).json({ message: 'The user was successfully deleted.' });
  } catch (err) {
    handleErr(err, req, res);
  }
}

module.exports.updateUserInfo = async (req, res) => {
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
    if (err.name === 'SequelizeDatabaseError') {
      res.status(400).json({ message: err.message });
    } else {
      handleErr(err, req, res);
    }
  }
}
