require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middleware/logger');
const routes = require('./routes/index');

const NotFoundError = require('./errors/notFoundError');// 404
const limiter = require('./utils/limiterConfig');

const { handleError } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const { DB_ADDRESS } = process.env;
app.use(requestLogger); // enabling the request logger
// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

mongoose.connect(DB_ADDRESS);
/** ****************************** */
app.use('/', routes);
app.get('*', () => {
  throw new NotFoundError('Requested resource not found!');
});
app.use(errorLogger); // enabling the error logger

app.use(errors());
// Custom Central Error Handler
app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(PORT, (error) => {
  // if everything works fine, the console will show which port the application is listening to
  // eslint-disable-next-line
  (error) ? console.log(`App error: ${error}`) : console.log(`App listening at port ${PORT}`);
});
