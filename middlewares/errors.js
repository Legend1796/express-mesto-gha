module.exports.errorHendler = (err, req, res, next) => {
  res.send(err);
  next();
};
