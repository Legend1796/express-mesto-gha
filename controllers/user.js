const User = require('../models/user');

const ERROR_BADREQUEST = 400;
const ERROR_NOTFOUND = 404;
const ERROR_SERVER = 500;

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(ERROR_NOTFOUND).send({ message: 'Такого пользователся не существует' });
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
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
      res.status(ERROR_NOTFOUND).send({ message: 'Такого пользователся не существует' });
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
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
      res.status(ERROR_NOTFOUND).send({ message: 'Такого пользователся не существует' });
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};
