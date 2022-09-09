const Card = require('../models/card');
const BadreqestError = require('../utils/BadreqestError');
const ForbiddenError = require('../utils/ForbiddenError');
const ServerError = require('../utils/ServerError');
const NotfoundError = require('../utils/NotfoundError');

module.exports.getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    res.send(card);
  } catch (err) {
    next(new ServerError('Произошла ошибка на сервере'));
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
      next(new BadreqestError('Переданы некорректные данные'));
    } else {
      next(new ServerError('Произошла ошибка на сервере'));
    }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      next(new NotfoundError('Такой карточки не существует'));
    } else if (card.owner.toString() !== req.user._id) {
      next(new ForbiddenError('У вас нет прав на удаление этой карточки'));
    } else {
      await Card.remove(card);
      res.send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadreqestError('Переданы некорректные данные'));
    } else {
      next(new ServerError('Произошла ошибка на сервере'));
    }
  }
};

module.exports.putLikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      next(new NotfoundError('Такой карточки не существует'));
    } else {
      res.send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadreqestError('Переданы некорректные данные'));
    } else {
      next(new ServerError('Произошла ошибка на сервере'));
    }
  }
};

module.exports.deleteLikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      next(new NotfoundError('Такой карточки не существует'));
    } else {
      res.send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadreqestError('Переданы некорректные данные'));
    } else {
      next(new ServerError('Произошла ошибка на сервере'));
    }
  }
};
