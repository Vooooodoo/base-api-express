const handleErr =  ((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .json({
      message: statusCode === 500
        ? 'An error occurred on the server.'
        : message,
    });

  next();
});

module.exports = handleErr;
