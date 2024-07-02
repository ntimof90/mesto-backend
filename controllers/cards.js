const mongoose = require('mongoose');
const Card = require('../models/card');
const ValidationError = require('../errors/validation');
const DocumentNotFoundError = require('../errors/document-not-found');
const ForbiddenError = require('../errors/forbidden');

exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.json(cards);
  } catch (e) {
    next(e);
  }
};

exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(201).json(card);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Input not valid'));
      return;
    }
    next(e);
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      throw new DocumentNotFoundError('Document not found');
    }
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Access denied');
    }
    await card.deleteOne();
    res.json(card);
  } catch (e) {
    next(e);
  }
};

exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new DocumentNotFoundError('Document not found');
    }
    res.json(card);
  } catch (e) {
    next(e);
  }
};

exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new DocumentNotFoundError('Document not found');
    }
    res.json(card);
  } catch (e) {
    next(e);
  }
};
