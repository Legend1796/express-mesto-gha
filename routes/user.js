const express = require('express');
const userRouters = require('express').Router();
const {
  getUsers, getUser, createUser, updateUser, updateUserAvatar,
} = require('../controllers/user');

userRouters.get('/users', express.json(), getUsers);
userRouters.get('/users/:userId', express.json(), getUser);
userRouters.post('/user', express.json(), createUser);
userRouters.post('/user/me', express.json(), updateUser);
userRouters.post('/user/me/avatar', express.json(), updateUserAvatar);

module.exports = { userRouters };
