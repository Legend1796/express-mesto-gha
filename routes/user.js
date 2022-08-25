const express = require('express');
const userRouters = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/user');

userRouters.get('/users', express.json(), getUsers);
userRouters.get('/users/:userId', express.json(), getUser);
userRouters.post('/user', express.json(), createUser);

module.exports = { userRouters };
