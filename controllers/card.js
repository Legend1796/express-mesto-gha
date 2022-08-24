const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('card')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link, ownerId, likes, createdAt,
  } = req.body;

  Card.create({
    name, link, owner: ownerId, likes, createdAt,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
