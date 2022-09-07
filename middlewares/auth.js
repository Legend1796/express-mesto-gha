const jwt = require('jsonwebtoken');
const error = require('../utils/errors');

const { JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    // res.send(payload);
  } catch (err) {
    const errAutorization = new Error('Необходима авторизация');
    errAutorization.statusCode = error.ERROR_UNAUTORIZED;
    next(errAutorization);
  }
  req.user = payload;
  next();
};
