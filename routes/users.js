const router = require('express').Router();
const {
  getUsers,
  createUser,
  removeUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:id', removeUser);

module.exports = router;
