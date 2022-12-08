const router = require('express').Router();

const {getFriends,messageUploadDB,messageGet,ImageMessageSend,messageSeen,delivaredMessage} = require('../controller/messengerController');

const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/get-friends', authMiddleware, getFriends); //applies the middleware before getting friends from bdd

router.post('/send-message', authMiddleware, messageUploadDB); //execute function messageUploadDb from messengerController with this route

router.get('/get-message/:id', authMiddleware, messageGet);

router.post('/image-message-send',authMiddleware, ImageMessageSend);
module.exports = router; 

router.post('/seen-message',authMiddleware, messageSeen);

router.post('/delivared-message',authMiddleware, delivaredMessage);