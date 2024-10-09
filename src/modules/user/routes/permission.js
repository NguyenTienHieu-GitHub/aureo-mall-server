const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/PermissionController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");

router.put(
  "/update/:id",
  authMiddleware.verifyToken,
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
  authMiddleware.checkPermission("create", "Permission"),
  permissionController.addPermission
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
