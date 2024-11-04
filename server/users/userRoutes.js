// server/users/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('./userController');

router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUser);
router.put('/user/:id', userController.editUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
