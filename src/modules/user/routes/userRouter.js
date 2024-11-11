const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  verifyToken,
  checkPermission,
} = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const User = require("../../auth/models/UserModel");
const Role = require("../../auth/models/RoleModel");
const {
  uploadAvatar,
  fixFilePath,
} = require("../../../shared/middleware/multer");

const models = [User, Role];

router.post(
  "/create",
  verifyToken,
  validateRequest(models),
  checkPermission("create", "User"),
  userController.createUser
);
router.delete(
  "/delete/myuser",
  verifyToken,
  checkPermission("delete_my_user", "User"),
  userController.deleteMyUser
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkPermission("delete_user", "User"),
  userController.deleteUser
);
router.put(
  "/update/myinfo",
  verifyToken,
  validateRequest(models),
  checkPermission("edit_my_info", "User"),
  uploadAvatar,
  fixFilePath,
  userController.updateMyInfo
);
router.put(
  "/update/:id",
  verifyToken,
  validateRequest(models),
  checkPermission("edit_user", "User"),
  userController.updateUser
);
router.get(
  "/myinfo",
  verifyToken,
  checkPermission("view_my_info", "User"),
  userController.getMyInfo
);
router.get(
  "/:id",
  verifyToken,
  checkPermission("view_user", "User"),
  userController.getUsersById
);
router.get(
  "/",
  verifyToken,
  checkPermission("view_all_users", "User"),
  userController.getAllUsers
);

module.exports = router;
