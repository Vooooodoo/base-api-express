const models = require('../database/models');
const handleErr = require('../errors/errorHandler');
const NotFoundError = require('../errors/NotFoundError');

const userNotFoundErr = new NotFoundError('Нет пользователя с таким id.');

const getUsers = async (req, res) => {
  try {
    const allUsers = await models.User.findAll({
      raw: true,
      attributes: { exclude: ['password'] },
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
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id.');
    }

    res.send(user);
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

    await models.User.destroy({ where: { id: req.params.id } });

    res.status(200).json({ message: 'Пользователь успешно удалён.' });
  } catch (err) {
    handleErr(err, req, res);
  }
}

const updateUserInfo = async (req, res) => {
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

    res.status(200).json({ message: 'Пользователь успешно обновлён.' });
  } catch (err) {
    handleErr(err, req, res);
  }
}

module.exports = {
  getUsers,
  getUser,
  removeUser,
  updateUserInfo,
};
