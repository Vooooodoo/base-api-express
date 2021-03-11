const handleErr =  ((err, req, res) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .json({
      message: statusCode === 500
        ? 'An error occurred on the server.'
        : message,
    });
});

module.exports = handleErr;
