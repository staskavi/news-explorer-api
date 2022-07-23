const handleKnownExceptions = (err, res) => {
  const { statusCode, message } = err;
  res.status(statusCode).json({ error: { message } });
};

const handleUnknownExceptions = (err, res) => {
  res.status(500).json({ error: { message: 'Something went wrong.' } });
};

const handleError = (err, res) => {
  // eslint-disable-next-line
   err.statusCode === 500 ? handleUnknownExceptions(err, res) : handleKnownExceptions(err, res);
};

module.exports = {
  handleKnownExceptions,
  handleUnknownExceptions,
  handleError,
};
