const express = require("express");
const router = express.Router();
const userController = require("../app/controller/UserController");
const { authMiddleware } = require("../app/middleware/AuthMiddleware");

router.post(
  "/create",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("create", "users"),
  userController.addUser
);
router.delete(
  "/delete/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("delete", "users"),
  userController.deleteUser
);
router.put(
  "/update/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("update", "users"),
  userController.updateUser
);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("read", "users"),
  userController.getUsersById
);
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("read", "users"),
  userController.getAllUsers
);

module.exports = router;
