const {Router} = require('express');
const router = Router();

const authController = require('../controllers/auth.controller')
const {registerValidator, loginValidator} = require('../middlewares/validators/auth.validator')

//  /api/auth
router.post('/register', registerValidator , authController.register);

router.post('/login', loginValidator, authController.login);

router.post('/getusers',  authController.getUsers);

module.exports = router;