require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();

const { userRouters } = require('./routes/user');
const { cardRouters } = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const { errorHendler } = require('./middlewares/errors');

app.use(express.json());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(10).pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.use(cookieParser());
app.use(auth, userRouters);
app.use(auth, cardRouters);
app.use((req, res) => {
  res.status(404).send({ message: 'Произошла ошибка' });
});
app.use(errors());
app.use(errorHendler);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
