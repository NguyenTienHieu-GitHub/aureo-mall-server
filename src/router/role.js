const express = require("express");
const router = express.Router();
const roleController = require("../app/controller/RoleController");
const { authMiddleware } = require("../app/middleware/AuthMiddleware");

router.post(
  "/add",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("create", "role"),
  roleController.addRole
);
router.delete(
  "/delete/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("delete", "role"),
  roleController.deleteRole
);
router.put(
  "/update/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("update", "role"),
  roleController.updateRole
);
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("read", "role"),
  roleController.getAllRole
);

module.exports = router;
