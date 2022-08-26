const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const card = await Card.find({});
    res.status(200).send(card);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.createCard = async (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  try {
    const card = await Card.create({
      name, link, owner: req.user._id, likes, createdAt,
    }, { runValidators: true });
    res.status(200).send(card);
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      res.status(404).send({ message: 'Такой карточки не существует' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
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
      res.status(404).send({ message: 'Такой карточки не существует' });
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
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
      res.status(404).send({ message: 'Такой карточки не существует' });
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.errors.name.name === 'ValidatorError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};
