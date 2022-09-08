const Card = require('../models/card');
const error = require('../utils/errors');

module.exports.getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    res.send(card);
  } catch (err) {
    const errServer = new Error('Произошла ошибка на сервере');
    err.statusCode = error.ERROR_SERVER;
    next(errServer);
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
      const errValidationError = new Error('Переданы некорректные данные');
      err.statusCode = error.ERROR_BADREQUEST;
      next(errValidationError);
    } else {
      const errServer = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errServer);
    }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      const errGetCard = new Error('Такой карточки не существует');
      errGetCard.statusCode = error.ERROR_NOTFOUND;
      next(errGetCard);
    } else if (card.owner.toString() !== req.user._id) {
      const errForbidden = new Error('У вас нет прав на удаление этой карточки');
      errForbidden.statusCode = error.ERROR_FORBIDDEN;
      next(errForbidden);
    } else {
      await Card.remove(card);
      res.send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      const errCastError = new Error('Переданы некорректные данные');
      err.statusCode = error.ERROR_BADREQUEST;
      next(errCastError);
    } else {
      const errServer = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errServer);
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
      const errGetCard = new Error('Такой карточки не существует');
      errGetCard.statusCode = error.ERROR_NOTFOUND;
      next(errGetCard);
    } else {
      res.send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      const errCastError = new Error('Переданы некорректные данные');
      err.statusCode = error.ERROR_BADREQUEST;
      next(errCastError);
    } else {
      const errServer = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errServer);
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
      const errGetCard = new Error('Такой карточки не существует');
      errGetCard.statusCode = error.ERROR_NOTFOUND;
      next(errGetCard);
    } else {
      res.send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      const errCastError = new Error('Переданы некорректные данные');
      err.statusCode = error.ERROR_BADREQUEST;
      next(errCastError);
    } else {
      const errServer = new Error('Произошла ошибка на сервере');
      err.statusCode = error.ERROR_SERVER;
      next(errServer);
    }
  }
};
