const router = require('express').Router();
const {
  getUsers,
  createUser,
  removeUser,
} = require('../controllers/users');
const {
  validateNewUser,
  validateLogin,
} = require('../middlewares/reqValidation');

router.get('/', getUsers);
router.post('/', validateNewUser, createUser);
router.delete('/:id', removeUser);

module.exports = router;
