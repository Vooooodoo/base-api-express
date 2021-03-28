const router = require('express').Router();
const { validateUserInfo } = require('../middlewares/reqValidation');
const checkIsForbiddenRout = require('../middlewares/isForbiddenRout');
const users = require('../controllers/users');

router.get('/', users.getUsers);
router.get('/:id', checkIsForbiddenRout, users.getUser);
router.patch('/:id', checkIsForbiddenRout, validateUserInfo, users.updateUserInfo);
router.delete('/:id', checkIsForbiddenRout, users.removeUser);

module.exports = router;
