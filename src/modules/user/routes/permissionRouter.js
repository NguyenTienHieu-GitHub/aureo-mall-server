const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/PermissionController");
const {
  verifyToken,
  checkPermission,
} = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Permission = require("../models/PermissionModel");
const RolePermission = require("../models/RolePermissionModel");
const models = [Permission, RolePermission];
router.put(
  "/update/:id",
  verifyToken,
  validateRequest(models),
  checkPermission("edit", "Permission"),
  permissionController.updatePermission
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkPermission("delete", "Permission"),
  permissionController.deletePermission
);
router.post(
  "/create",
  verifyToken,
  validateRequest(models),
  checkPermission("create", "Permission"),
  permissionController.createPermission
);
router.get(
  "/:id",
  verifyToken,
  checkPermission("view", "Permission"),
  permissionController.getPermissionById
);
router.get(
  "/",
  verifyToken,
  checkPermission("view", "Permission"),
  permissionController.getAllPermissions
);
module.exports = router;
