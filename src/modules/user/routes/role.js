const express = require("express");
const router = express.Router();
const roleController = require("../controllers/RoleController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");

router.post(
  "/create",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("create", "Role"),
  roleController.addRole
);
router.delete(
  "/delete/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("delete", "Role"),
  roleController.deleteRole
);
router.put(
  "/update/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("edit", "Role"),
  roleController.updateRole
);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("view", "Role"),
  roleController.getRoleById
);
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("view", "Role"),
  roleController.getAllRole
);

module.exports = router;
