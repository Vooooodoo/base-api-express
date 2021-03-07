const router = require('express').Router();
const { validateUserInfo } = require('../middlewares/reqValidation');
const {
  getUsers,
  getUser,
  removeUser,
  setUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/me', validateUserInfo, setUserInfo);
router.delete('/:id', removeUser);

module.exports = router;
