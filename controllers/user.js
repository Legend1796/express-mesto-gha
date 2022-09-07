const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const error = require('../utils/errors');

const { JWT_SECRET } = process.env;

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    const errGetUsers = new Error('Произошла ошибка на сервере');
    err.statusCode = error.ERROR_SERVER;
    next(errGetUsers);
  }
};

module.exports.getUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const errUserNotFound = new Error('Такого пользователся не существует');
      errUserNotFound.statusCode = error.ERROR_NOTFOUND;
      next(errUserNotFound);
    } else {
      res.send({
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      const errCastError = new Error('Переданы некорректные данные');
      err.statusCode = error.ERROR_BADREQUEST;
      next(errCastError);
    } else {
      const errGetUser = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errGetUser);
    }
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name, about, avatar, email, password: hash,
      });
      res.send({
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      });
    } else {
      const errServer = new Error('Пользователь с такой электронной почтой уже зарегистрирован');
      errServer.statusCode = error.ERROR_CONFLICT;
      next(errServer);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errValidationError = new Error('Переданы некорректные данные');
      err.statusCode = error.ERROR_BADREQUEST;
      next(errValidationError);
    } else {
      const errGetUsers = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errGetUsers);
    }
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      const errUserNotFound = new Error('Такого пользователся не существует');
      errUserNotFound.statusCode = error.ERROR_NOTFOUND;
      next(errUserNotFound);
    } else {
      res.send({
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errValidationError = new Error('Переданы некорректные данные');
      err.statusCode = error.ERROR_BADREQUEST;
      next(errValidationError);
    } else {
      const errGetUsers = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errGetUsers);
    }
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      const errUserNotFound = new Error('Такого пользователся не существует');
      errUserNotFound.statusCode = error.ERROR_NOTFOUND;
      next(errUserNotFound);
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      const errValidationError = new Error('Переданы некорректные данные');
      err.statusCode = error.ERROR_BADREQUEST;
      next(errValidationError);
    } else {
      const errGetUsers = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errGetUsers);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const errAutorization = new Error('Неправильные почта или пароль');
      errAutorization.statusCode = error.ERROR_UNAUTORIZED;
      next(errAutorization);
    } else {
      const isUserValid = await bcrypt.compare(password, user.password);
      if (isUserValid) {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true });
        res.send({ token });
      } else {
        const errAutorization = new Error('Неправильные почта или пароль');
        errAutorization.statusCode = error.ERROR_UNAUTORIZED;
        next(errAutorization);
      }
    }
  } catch (err) {
    if (err.name === 'CastError') {
      const errCastError = new Error('Переданы некорректные данные');
      err.statusCode = error.ERROR_BADREQUEST;
      next(errCastError);
    } else {
      const errGetUsers = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errGetUsers);
    }
  }
};

module.exports.getUserMe = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const errUserNotFound = new Error('Такого пользователся не существует');
      errUserNotFound.statusCode = error.ERROR_NOTFOUND;
      next(errUserNotFound);
    } else {
      res.send({
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      const errCastError = new Error('Переданы некорректные данные');
      errCastError.statusCode = error.ERROR_BADREQUEST;
      next(errCastError);
    } else {
      const errGetUsers = new Error('Произошла ошибка на сервере');
      errGetUsers.statusCode = error.ERROR_SERVER;
      next(errGetUsers);
    }
  }
};
