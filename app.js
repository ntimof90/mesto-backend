const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const cors = require('cors');

const router = require('./routes');

const { MONGO_URL } = require('./config');

const errorHandler = require('./middlewares/error-handler');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const allowedCors = ['http://localhost:3000'];

mongoose.connect(MONGO_URL, {
  family: 4,
});

const app = express();

app.use(cors({ origin: allowedCors }));

app.use(requestLogger);

app.use(express.json());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

module.exports = app;
