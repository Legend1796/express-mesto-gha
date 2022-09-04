const userRouters = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, createUser, updateUser, updateUserAvatar,
} = require('../controllers/user');

userRouters.get('/users', getUsers);
userRouters.get('/users/:userId', getUser);
userRouters.post('/users', createUser);
userRouters.patch('/users/me', updateUser);
userRouters.patch('/users/me/avatar', updateUserAvatar);

module.exports = { userRouters };

// celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.number().min(2).max(30),
//     avatar: Joi.string().min(2).max(30),
//     email: Joi.string().required().email(),
//     password: Joi.string().min(8),
//   }),
// }),
