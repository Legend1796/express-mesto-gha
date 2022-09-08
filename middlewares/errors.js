module.exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  let errorMessage;
  if (statusCode === 500) {
    errorMessage = 'Произошла ошибка на сервере';
  } else {
    errorMessage = err.message;
  }
  res.status(statusCode).send({ errorMessage });
  next();
};
