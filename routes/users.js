const router = require('express').Router();
const { validateUserInfo } = require('../middlewares/reqValidation');
const { checkIsForbiddenRout } = require('../middlewares/isForbiddenRout');
const {
  getUsers,
  getUser,
  removeUser,
  updateUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', checkIsForbiddenRout, getUser);
router.patch('/:id', checkIsForbiddenRout, validateUserInfo, updateUserInfo);
router.delete('/:id', checkIsForbiddenRout, removeUser);

module.exports = router;
