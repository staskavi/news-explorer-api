require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middleware/logger');
const helmet = require('helmet');
const usersRouter = require('./routes/users');
const articleRouter = require('./routes/article');
const signInRouter = require('./routes/signIn');
const signUpRouter = require('./routes/signUp');
const NotFoundError = require('./errors/notFoundError');//404
const limiter = require('./utils/limiterConfig');
const { errors, celebrate, Joi } = require('celebrate');
const auth = require('./middleware/auth');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const { DB_ADDRESS } = process.env;
app.use(requestLogger); // enabling the request logger
// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

mongoose.connect(DB_ADDRESS);
/*********************************/
app.use('/', signInRouter);
app.use('/', signUpRouter);
app.use(auth);
app.use('/', usersRouter);
app.use('/', articleRouter);
app.use('*', () => {
  throw new NotFoundError('Requested resource not found!');
});
app.use(errorLogger); // enabling the error logger

app.use(errors());
// Central Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Server error :(' : message,
  });
});

app.listen(PORT, (error) => {
  // if everything works fine, the console will show which port the application is listening to
  // eslint-disable-next-line
  (error) ? console.log(`App error: ${error}`) : console.log(`App listening at port ${PORT}`);
});
