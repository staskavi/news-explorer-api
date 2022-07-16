const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const errorStatuses = require('../utils/errorStatuses');
const BadRequestError = require('../errors/badRequestError');//400
const UnauthorizedError = require('../errors/unauthorizedError');//401
const NotFoundError = require('../errors/notFoundError');//404
const UserExistsError = require('../errors/userExistsError');//409

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('No users found in Data Base');
      }
      return res.status(errorStatuses.OK).send(users);
    })
    .catch(next);
};

// eslint-disable-next-line
const getUserByID = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('There is no user with such ID');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Invalid ID');
      }
      next(err);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Bad request');
      }
      res.status(errorStatuses.NEW_DATA_ADDED).send({
        name: user.name,
        email: user.email,
        _id: user._id,
        message: 'User created successfully' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
      throw new BadRequestError('E-mail and password are required');
    } else if (err.code === 409) {
        throw new UserExistsError('User is already exists');
      }
      next(err);
    })
    .catch(next);
};


const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Bad request');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        { expiresIn: '7d' },
      );
      res.status(errorStatuses.OK).send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        throw new UnauthorizedError('Incorrect e-mail or password');
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserByID, createUser, login
};
