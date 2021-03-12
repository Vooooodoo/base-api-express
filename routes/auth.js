const router = require('express').Router();
const { validateNewUser, validateLogin } = require('../middlewares/reqValidation');
const { signUp, signIn } = require('../controllers/auth');

router.post('/sign-up', validateNewUser, signUp);
router.post('/sign-in', validateLogin, signIn);

module.exports = router;
