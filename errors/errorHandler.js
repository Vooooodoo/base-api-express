const handleErr =  ((err, req, res) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .json({
      message: statusCode === 500
        ? 'На сервере произошла ошибка.'
        : message,
    });
});

module.exports = handleErr;
