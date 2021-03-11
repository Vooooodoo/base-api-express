const router = require('express').Router();
const { validateUserInfo } = require('../middlewares/reqValidation');
const {
  getUsers,
  getUser,
  removeUser,
  updateUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/:id', validateUserInfo, updateUserInfo);
router.delete('/:id', removeUser);

module.exports = router;
