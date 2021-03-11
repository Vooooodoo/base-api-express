const checkIsForbiddenRout = (req, res, next) => {
  if (Number(req.params.id) !== req.user.id) {
    res.status(403).json({ message: 'Недостаточно прав для выполнения операции.' });
  }

  next();
}

module.exports = checkIsForbiddenRout;
