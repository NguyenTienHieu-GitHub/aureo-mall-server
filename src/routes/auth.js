const express = require('express');
const router = express.Router();
const authController = require('../app/controller/AuthController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;