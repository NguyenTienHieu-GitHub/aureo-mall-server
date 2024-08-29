const express = require('express');
const router = express.Router();
const userController = require('../app/controller/UserController');

router.get('/:id/users', userController.getUsersById);
router.post('/create', userController.addUser);
router.delete('/:id/delete', userController.deleteUser);
router.put('/:id/update', userController.updateUser);
router.get('/users', userController.getUsers);

module.exports = router;