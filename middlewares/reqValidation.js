const { celebrate, Joi } = require('celebrate');

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
});

const validateNewUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    dob: Joi.string().required().min(8).max(20),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    dob: Joi.string().required().min(2).max(20),
  }),
});

module.exports = { validateId, validateNewUser, validateLogin, validateUserInfo };
