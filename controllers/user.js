const User = require('../models/user');

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
  // User.find({})
  //   .populate('user')
  //   .then((users) => res.send({ data: users }))
  //   .catch((err) => res.status(500).send({ message: err.message }));
};

const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  res.status(200).send({ data: user });
  // User.findById(req.params.id)
  //   .then((user) => res.send({ data: user }))
  //   .catch((err) => res.status(500).send({ message: err.message }));
};

const createUser = (req, res) => {
  res.status(200).send(req.body);
  // const {
  //   name, about, avatar,
  // } = req.body;

  // User.create({
  //   name, about, avatar,
  // })
  //   .then((user) => res.send({ data: user }))
  //   .catch((err) => res.status(500).send({ message: `Ahtung!!! ${err.message}` }));
};

module.exports = { getUsers, getUser, createUser };
