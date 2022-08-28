const Card = require('../models/card');

const ERROR_BADREQUEST = 400;
const ERROR_NOTFOUND = 404;
const ERROR_SERVER = 500;

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find({});
    res.send(card);
  } catch (err) {
    res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.createCard = async (req, res) => {
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
      res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      res.status(ERROR_NOTFOUND).send({ message: 'Такой карточки не существует' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_BADREQUEST).send({ message: 'Невалидный id ' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports.putLikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
      { runValidators: true },
    );
    if (!card) {
      res.status(ERROR_NOTFOUND).send({ message: 'Такой карточки не существует' });
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports.deleteLikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
      { runValidators: true },
    );
    if (!card) {
      res.status(ERROR_NOTFOUND).send({ message: 'Такой карточки не существует' });
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_BADREQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};
