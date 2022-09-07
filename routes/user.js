const userRouters = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateUserAvatar, getUserMe,
} = require('../controllers/user');
const { auth } = require('../middlewares/auth');

userRouters.get('/users', getUsers);
userRouters.get('/users/me', auth, getUserMe);
userRouters.get('/users/:userId', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().id(),
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
    avatar: Joi.string().min(2).max(30),
  }),
}), updateUserAvatar);

module.exports = { userRouters };
