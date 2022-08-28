const userRouters = require('express').Router();
const {
  getUsers, getUser, createUser, updateUser, updateUserAvatar,
} = require('../controllers/user');

userRouters.get('/users', getUsers);
userRouters.get('/users/:userId', getUser);
userRouters.post('/users', createUser);
userRouters.patch('/users/me', updateUser);
userRouters.patch('/users/me/avatar', updateUserAvatar);

module.exports = { userRouters };
