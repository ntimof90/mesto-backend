const { mongoose } = require('mongoose');
// Модуль хеширования пароля
const bcryptjs = require('bcryptjs');
// Модуль создания токена
const jsonWebToken = require('jsonwebtoken');
// Модель пользователей
const User = require('../models/user');
// Секретный ключ подписи
const { JWT_SECRET, MONGO_DUBLICATE_ERR_CODE } = require('../config');
const UnauthorizedError = require('../errors/unauthorized');
const ConflictError = require('../errors/conflict');
const DocumentNotFoundError = require('../errors/document-not-found');
const ValidationError = require('../errors/validation');

const getUserToken = (user, secretKey) => {
  const { _id } = user;
  return jsonWebToken.sign({ _id }, secretKey, { expiresIn: '7d' });
};

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const hash = await bcryptjs.hash(password, 10);
    const user = await User.create({ email, password: hash });
    user.password = undefined;
    const token = getUserToken(user, JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (e) {
    if (e.code === MONGO_DUBLICATE_ERR_CODE) {
      next(new ConflictError('This email address is already in use'));
      return;
    }
    next(e);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }
    const isMatched = await bcryptjs.compare(password, user.password);
    if (!isMatched) {
      throw new UnauthorizedError('Invalid email or password');
    }
    const token = getUserToken(user, JWT_SECRET);
    res.json({ token });
  } catch (e) {
    next(e);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (e) {
    next(e);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new DocumentNotFoundError('User not found');
    }
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    res.json(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Input not valid'));
      return;
    }
    next(e);
  }
};
