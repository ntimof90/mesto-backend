const router = require('express').Router();
const { signup, login } = require('../controllers/users');
const { signupValidator, loginValidator } = require('../middlewares/validator');

router.post('/signup', signupValidator, signup);

router.post('/signin', loginValidator, login);

module.exports = router;
