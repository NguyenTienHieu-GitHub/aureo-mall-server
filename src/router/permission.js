const express = require("express");
const router = express.Router();
const permissionController = require("../app/controller/PermissionController");
const { authMiddleware } = require("../app/middleware/AuthMiddleware");

router.post(
  "/add",
  authMiddleware.verifyToken,
  // authMiddleware.checkPermission("create", "permission"),
  permissionController.addPermission
);
module.exports = router;
