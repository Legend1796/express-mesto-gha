const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const { userRouters } = require('./user');
const { cardRouters } = require('./card');
const { auth } = require('../middlewares/auth');
const NotfoundError = require('../utils/NotfoundError');
const { login, createUser, logout } = require('../controllers/user');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.get('/signout', logout);
router.use(auth);
router.use(userRouters);
router.use(cardRouters);
router.use((req, res, next) => {
  next(new NotfoundError('Произошла ошибка'));
});
router.use(errors());

module.exports = router;
