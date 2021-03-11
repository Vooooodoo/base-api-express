const checkIsForbiddenRout = (req, res, next) => {
  if (Number(req.params.id) !== req.user.id) {
    res.status(403).json({ message: 'Insufficient permissions to perform the operation.' });
  }

  next();
}

module.exports = checkIsForbiddenRout;
