const User = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId, { runValidators: true });
    if (!user) {
      res.status(404).send({ message: 'Такого пользователся не существует' });
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.status(200).send(user);
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.updateUser = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { runValidators: true },
    );
    if (!user) {
      res.status(404).send({ message: 'Такого пользователся не существует' });
    }
    res.status(200).send(user);
  } catch (err) {
    res.send(err);
    if (err.errors.about.name === 'ValidatorError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    // const user = await User.findByIdAndUpdate(req.user._id, { avatar });
    const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true });
    if (!user) {
      res.status(404).send({ message: 'Такого пользователся не существует' });
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};
