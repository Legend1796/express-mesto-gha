require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const NotfoundError = require('./utils/NotfoundError');

const { PORT = 3000 } = process.env;
const app = express();

const { userRouters } = require('./routes/user');
const { cardRouters } = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');

app.use(express.json());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.use(cookieParser());
app.use(auth);
app.use(userRouters);
app.use(cardRouters);
app.use((req, res, next) => {
  next(new NotfoundError('Произошла ошибка'));
});
app.use(errors());
app.use(errorHandler);

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });

    await app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
