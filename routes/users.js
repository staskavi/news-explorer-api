const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserByID,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get(
  '/users/me',
  celebrate({
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(true),
  }),
  getUserByID,
);

module.exports = router;
