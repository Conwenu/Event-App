const express = require('express');
const router = express.Router();
const authController = require('./authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.post('/verifyJWT', authController.verifyJWT);
router.get('/refresh', authController.handleRefreshToken);
module.exports = router;