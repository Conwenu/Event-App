const express = require('express');
const router = express.Router();
const authController = require('./authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.post('/verifyJWT', authController.verifyJWT);
router.get('/refresh', authController.handleRefreshToken);
router.put('/updateUsername', authController.verifyJWT, authController.handleUsernameChange);
router.put('/updatePassword', authController.verifyJWT, authController.handlePasswordChange);
router.put('/updateEmail', authController.verifyJWT, authController.handleEmailChange);
router.delete('/deleteAccount', authController.verifyJWT, authController.deleteAccount);
module.exports = router;