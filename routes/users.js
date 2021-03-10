const router = require('express').Router();
const { validateId, validateUserInfo } = require('../middlewares/reqValidation');
const {
  getUsers,
  getUser,
  removeUser,
  updateUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', validateId, getUser);
router.patch('/:id', validateId, validateUserInfo, updateUserInfo);
router.delete('/:id', validateId, removeUser);

module.exports = router;
