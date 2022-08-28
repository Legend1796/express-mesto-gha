const cardRouters = require('express').Router();
const {
  getCards, createCard, deleteCard, putLikeCard, deleteLikeCard,
} = require('../controllers/card');

cardRouters.get('/cards', getCards);
cardRouters.post('/cards', createCard);
cardRouters.delete('/cards/:cardId', deleteCard);
cardRouters.put('/cards/:cardId/likes', putLikeCard);
cardRouters.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = { cardRouters };
