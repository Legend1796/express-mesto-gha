const Card = require('../models/card');
const error = require('../utils/errors');

module.exports.getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    res.send(card);
  } catch (err) {
    const errGetUsers = new Error('Произошла ошибка на сервере');
    err.statusCode = error.ERROR_SERVER;
    next(errGetUsers);
  }
};

module.exports.createCard = async (req, res, next) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  try {
    const card = await Card.create({
      name, link, owner: req.user._id, likes, createdAt,
    });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(error.ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      const errGetUsers = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errGetUsers);
    }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      res.status(error.ERROR_NOTFOUND).send({ message: 'Такой карточки не существует' });
    } else if (card.owner !== req.user._id) {
      res.status(error.ERROR_SERVER).send({ message: 'У вас нет прав на удаление этой карточки' });
    } else {
      res.send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(error.ERROR_BADREQUEST).send({ message: 'Невалидный id ' });
    } else {
      const errGetUsers = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errGetUsers);
    }
  }
};

module.exports.putLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      res.status(error.ERROR_NOTFOUND).send({ message: 'Такой карточки не существует' });
    } else {
      res.send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(error.ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      const errGetUsers = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errGetUsers);
    }
  }
};

module.exports.deleteLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      res.status(error.ERROR_NOTFOUND).send({ message: 'Такой карточки не существует' });
    } else {
      res.send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(error.ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      const errGetUsers = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errGetUsers);
    }
  }
};
