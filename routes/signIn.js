const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { login } = require('../controllers/users');

router.post(
  '/signin',
  celebrate({
      body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().alphanum().min(3).max(8).required(),
    }),
  }),
  login,
);

module.exports = router;
