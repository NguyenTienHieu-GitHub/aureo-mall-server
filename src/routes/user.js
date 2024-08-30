const express = require('express');
const router = express.Router();
const userController = require('../app/controller/UserController');
const authMiddleware = require('../app/middleware/AuthMiddleware');

router.get('/users/:id', userController.getUsersById);
router.post('/create', userController.addUser);
router.delete('/delete/:id',authMiddleware.verifyTokenAndAdminAuth , userController.deleteUser);
router.put('/update/:id', userController.updateUser);
router.get('/',authMiddleware.verifyToken , userController.getUsers);

module.exports = router;