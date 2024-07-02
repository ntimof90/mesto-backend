require('dotenv').config();

const {
  NODE_ENV = 'development',
  PORT = 3000,
  JWT_SECRET,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
  MONGO_DUBLICATE_ERR_CODE = 11000,
} = process.env;

const urlRegexp = /^https?:\/\/(w(3)\.)?([\w\d-]+\.)+(\w+\/)([\w\d-.~:/?#[\]@!$&'*+,;=()%]+)$/i;

module.exports = {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  MONGO_URL,
  MONGO_DUBLICATE_ERR_CODE,
  urlRegexp,
};
