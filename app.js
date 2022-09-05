require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

const { userRouters } = require('./routes/user');
const { cardRouters } = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const { errorHendler } = require('./middlewares/errors');

app.use(express.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(cookieParser());
app.use(auth, userRouters);
app.use(auth, cardRouters);
app.use((req, res) => {
  res.status(404).send({ message: 'Произошла ошибка' });
});
app.use(errorHendler);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
