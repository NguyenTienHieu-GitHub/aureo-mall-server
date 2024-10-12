const express = require("express");
const router = express.Router();
const roleController = require("../controllers/RoleController");
const {
  verifyToken,
  verifyRefreshToken,
  verifyTokenBlacklist,
  checkPermission,
} = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Role = require("../../auth/models/RoleModel");
const models = [Role];
router.post(
  "/create",
  verifyToken,
  validateRequest(models),
  checkPermission("create", "Role"),
  roleController.createRole
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkPermission("delete", "Role"),
  roleController.deleteRole
);
router.put(
  "/update/:id",
  verifyToken,
  validateRequest(models),
  checkPermission("edit", "Role"),
  roleController.updateRole
);
router.get(
  "/:id",
  verifyToken,
  checkPermission("view", "Role"),
  roleController.getRoleById
);
router.get(
  "/",
  verifyToken,
  checkPermission("view", "Role"),
  roleController.getAllRole
);

module.exports = router;
