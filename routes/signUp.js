const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { createUser } = require('../controllers/users');

router.post(
  '/signup',
  celebrate({
      body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      password: Joi.string().alphanum().min(3).max(8).required(),
    }),
  }),
  createUser,
);

module.exports = router;
