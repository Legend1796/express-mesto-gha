const bcrypt = require('bcryptjs');
const User = require('../models/user');
const error = require('../utils/errors');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(error.ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(error.ERROR_NOTFOUND).send({ message: 'Такого пользователся не существует' });
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(error.ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(error.ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports.createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    res.send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(error.ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(error.ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports.updateUser = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(error.ERROR_NOTFOUND).send({ message: 'Такого пользователся не существует' });
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(error.ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(error.ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(error.ERROR_NOTFOUND).send({ message: 'Такого пользователся не существует' });
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      res.status(error.ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(error.ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.params;
  try {
    const user = await User.findOne(email);
    if (!email) {
      res.status(error.ERROR_UNAUTORIZED).send({ message: 'Неправильные почта или пароль' });
    } else {
      bcrypt.compare(password, user.password);
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(error.ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(error.ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};
