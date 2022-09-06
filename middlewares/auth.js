const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    res.send(payload);
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};
