const userRouters = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateUserAvatar, getUserMe,
} = require('../controllers/user');

userRouters.get('/users', getUsers);
userRouters.get('/users/me', getUserMe);
userRouters.get('/users/:userId', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().pattern(/[\da-f]{24}/),
  }),
}), getUser);
userRouters.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
userRouters.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(8).pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/),
  }),
}), updateUserAvatar);

module.exports = { userRouters };
