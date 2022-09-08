const cardRouters = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, putLikeCard, deleteLikeCard,
} = require('../controllers/card');

cardRouters.get('/cards', getCards);
cardRouters.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/),
  }),
}), createCard);
cardRouters.delete('/cards/:cardId', deleteCard);
cardRouters.put('/cards/:cardId/likes', putLikeCard);
cardRouters.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = { cardRouters };
