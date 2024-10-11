const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/PermissionController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Permission = require("../models/PermissionModel");
const RolePermission = require("../models/RolePermissionModel");
const models = [Permission, RolePermission];
router.put(
  "/update/:id",
  authMiddleware.verifyToken,
  validateRequest(models),
  authMiddleware.checkPermission("edit", "Permission"),
  permissionController.updatePermission
);
router.delete(
  "/delete/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("delete", "Permission"),
  permissionController.deletePermission
);
router.post(
  "/create",
  authMiddleware.verifyToken,
  validateRequest(models),
  authMiddleware.checkPermission("create", "Permission"),
  permissionController.createPermission
);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("view", "Permission"),
  permissionController.getPermissionById
);
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("view", "Permission"),
  permissionController.getAllPermissions
);
module.exports = router;
