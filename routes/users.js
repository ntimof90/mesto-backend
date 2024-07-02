const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  idValidator,
  profileValidator,
  avatarValidator,
} = require('../middlewares/validator');

router.get('/', getUsers);

router.get('/:id', idValidator, getUserById);

router.patch('/me', profileValidator, updateProfile);

router.patch('/me/avatar', avatarValidator, updateAvatar);

module.exports = router;
