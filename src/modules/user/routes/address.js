const express = require("express");
const router = express.Router();
const addressController = require("../controllers/AddressController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Address = require("../models/AddressModel");

router.delete(
  "/delete/:id",
  authMiddleware.verifyToken,
  authMiddleware.checkPermission("delete_my_address", "Address"),
  addressController.deleteAddress
);
router.put(
  "/update/:id",
  authMiddleware.verifyToken,
  validateRequest(Address),
  authMiddleware.checkPermission("edit", "Address"),
  addressController.updateAddress
);
router.post(
  "/create",
  authMiddleware.verifyToken,
  validateRequest(Address),
  authMiddleware.checkPermission("create", "Address"),
  addressController.createAddress
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
