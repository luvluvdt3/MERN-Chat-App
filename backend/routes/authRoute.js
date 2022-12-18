const router = require('express').Router();
const {userRegister,userLogin,userLogout} = require('../controller/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/user-register',userRegister);
//execute whatever is in authController
//already declared in frontend/src/store/actions/authAction.js

router.post('/user-login',userLogin);

router.post('/user-logout',authMiddleware,userLogout);

module.exports = router;