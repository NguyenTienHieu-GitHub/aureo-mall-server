const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");

router.post(
  "/create",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("create", "User"),
  userController.createUser
);
router.delete(
  "/delete/myuser",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("delete_my_user", "User"),
  userController.deleteMyUser
);
router.delete(
  "/delete/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("delete_user", "User"),
  userController.deleteUser
);
router.put(
  "/update/myinfo",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("edit_my_info", "User"),
  userController.updateMyInfo
);
router.put(
  "/update/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("edit_user", "User"),
  userController.updateUserByAdmin
);
router.get(
  "/myinfo",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("view_my_info", "User"),
  userController.getMyInfo
);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("view_user", "User"),
  userController.getUsersById
);
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("view_all_users", "User"),
  userController.getAllUsers
);

module.exports = router;
