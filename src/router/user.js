const express = require("express");
const router = express.Router();
const userController = require("../app/controller/UserController");
const { authMiddleware } = require("../app/middleware/AuthMiddleware");

router.post(
  "/create",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("Create"),
  userController.addUser
);
router.delete(
  "/delete/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("Delete"),
  userController.deleteUser
);
router.put(
  "/update/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("Update"),
  userController.updateUser
);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("Read"),
  userController.getUsersById
);
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("Read"),
  userController.getAllUsers
);

module.exports = router;
