module.exports = (error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .json({
      statusCode,
      message: statusCode === 500 ? 'Internal server error' : message,
    });
};
