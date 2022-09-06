const jwt = require('jsonwebtoken');
// const error = require('../utils/errors');

const { JWT_SECRET } = process.env;

// const handleAuthError = (res) => {
//   res.status(error.ERROR_UNAUTORIZED).send({ message: 'Необходима авторизация' });
// };

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};
