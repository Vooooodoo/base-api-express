const router = require('express').Router();
const { getUsers, removeUser } = require('../controllers/users');

router.get('/', getUsers);
router.delete('/:id', removeUser);

module.exports = router;
