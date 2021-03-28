const ForbiddenError = require('../errors/ForbiddenError');

const checkIsForbiddenRout = (req, res, next) => {
  if (Number(req.params.id) !== req.user.id) {
    throw new ForbiddenError('Insufficient permissions to perform the operation.');
  }

  next();
}

module.exports = checkIsForbiddenRout;
