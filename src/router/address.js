const express = require("express");
const router = express.Router();
const addressController = require("../app/controller/AddressController");
const { authMiddleware } = require("../app/middleware/AuthMiddleware");

router.delete(
  "/delete/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("delete", "users"),
  addressController.deleteAddress
);
router.put(
  "/update/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("update", "users"),
  addressController.updateAddress
);
router.post(
  "/add",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("create", "users"),
  addressController.addAddress
);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("read", "users"),
  addressController.getAddressById
);
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("read", "users"),
  addressController.getAllAddress
);

module.exports = router;
