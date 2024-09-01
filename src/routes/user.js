const express = require("express");
const router = express.Router();
const userController = require("../app/controller/UserController");
const authMiddleware = require("../app/middleware/AuthMiddleware");

router.post(
  "/create",
  authMiddleware.verifyTokenAndAdminAuth,
  userController.addUser
);
router.delete(
  "/delete/:id",
  authMiddleware.verifyTokenAndAdminAuth,
  userController.deleteUser
);
router.put(
  "/update/:id",
  authMiddleware.verifyTokenAndAdminAuth,
  userController.updateUser
);
router.get("/:id", authMiddleware.verifyToken, userController.getUsersById);
router.get("/", authMiddleware.verifyToken, userController.getAllUsers);

module.exports = router;
