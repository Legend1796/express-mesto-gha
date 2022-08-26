const express = require('express');
const cardRouters = require('express').Router();
const {
  getCards, createCard, deleteCard, putLikeCard, deleteLikeCard,
} = require('../controllers/card');

cardRouters.get('/cards', express.json(), getCards);
cardRouters.post('/cards', express.json(), createCard);
cardRouters.delete('/cards/:cardId', express.json(), deleteCard);
cardRouters.put('/cards/:cardId/likes', express.json(), putLikeCard);
cardRouters.delete('/cards/:cardId/likes', express.json(), deleteLikeCard);

module.exports = { cardRouters };
