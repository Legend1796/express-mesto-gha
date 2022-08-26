const User = require('../models/user');

const getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
};

const getUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  res.status(200).send(user);
};
// User.findById(req.params.id)
//     .then((user) => res.status(200).send(user));

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = { getUsers, getUser, createUser };
