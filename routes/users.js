const router = require('express').Router();
const {
  getUsers, updateUser, updateAvatar, getUserById, getCurrentUser,
} = require('../controllers/users');
const { validateUserId, validateProfile, validateAvatar } = require('../middlewares/request-validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateProfile, updateUser);
router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
