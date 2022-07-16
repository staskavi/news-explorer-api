const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorizedError');//401

const userSchema = new mongoose.Schema({
    name: { // every user has a name field, the requirements for which are described below:
        type: String, // the name is a string
        required: true, // every user has a name, so it's a required field
        minlength: 2, // the minimum length of the name is 2 characters
        maxlength: 30, // the maximum length is 30 characters
      },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.v} is not a valid e-mail!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

  versionKey: false
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Wrong e-mail or password');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Wrong e-mail or password');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
