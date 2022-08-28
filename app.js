const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

const { userRouters } = require('./routes/user');
const { cardRouters } = require('./routes/card');

app.use((req, res, next) => {
  req.user = { _id: '63089f327f31bce17be8519c' };
  next();
});
app.use(express.json());
app.use(userRouters);
app.use(cardRouters);
app.use((req, res) => {
  res.status(404).send({ message: 'Произошла ошибка' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
