const express = require("express");
const router = express.Router();
const addressController = require("../app/controller/AddressController");
const { authMiddleware } = require("../app/middleware/AuthMiddleware");

router.delete(
  "/delete/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("delete_my_address", "Address"),
  addressController.deleteAddress
);
router.put(
  "/update/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("edit", "Address"),
  addressController.updateAddress
);
router.post(
  "/create",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("create", "Address"),
  addressController.addAddress
);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("view_address", "Address"),
  addressController.getAddressById
);
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("view_all_addresses", "Address"),
  addressController.getAllAddress
);

module.exports = router;
