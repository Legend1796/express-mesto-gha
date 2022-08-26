const express = require('express');
const userRouters = require('express').Router();
const {
  getUsers, getUser, createUser, updateUser, updateUserAvatar,
} = require('../controllers/user');

userRouters.get('/users', express.json(), getUsers);
userRouters.get('/users/:userId', express.json(), getUser);
userRouters.post('/users', express.json(), createUser);
userRouters.post('/users/me', express.json(), updateUser);
userRouters.post('/users/me/avatar', express.json(), updateUserAvatar);

module.exports = { userRouters };
