const router = require('express').Router();

const auth = require('../middlewares/auth');

const authRouter = require('./auth');

const usersRouter = require('./users');

const cardsRouter = require('./cards');

router.use('/', authRouter);

router.use(auth);

router.use('/users', usersRouter);

router.use('/cards', cardsRouter);

module.exports = router;
