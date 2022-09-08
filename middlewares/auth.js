const jwt = require('jsonwebtoken');
const UnautorizedError = require('../utils/UnautorizedError');

const JWT_SECRET = 'secret';

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnautorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
