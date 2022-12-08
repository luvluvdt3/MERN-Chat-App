const router = require('express').Router();

const {userRegister, userLogin} = require('../controller/authController');
router.post('/user-register',userRegister);
//execute whatever is in authController
//already declared in frontend/src/store/actions/authAction.js

router.post('/user-login',userLogin);
module.exports = router;