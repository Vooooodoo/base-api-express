// централизованн обработка ошибок
const handleErr =  ((err, req, res) => {
  // если ошибка сгенерирована не нами, через throw new ErrorClass - выставляем статус 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .json({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка. Что-то пошло не так.'
        : message,
    });

  // next();
});

module.exports = handleErr;
