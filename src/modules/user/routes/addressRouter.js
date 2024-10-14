const express = require("express");
const router = express.Router();
const addressController = require("../controllers/AddressController");
const {
  verifyToken,
  checkPermission,
} = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Address = require("../models/AddressModel");
const models = [Address];

router.delete(
  "/delete/:id",
  verifyToken,
  checkPermission("delete_my_address", "Address"),
  addressController.deleteAddress
);
router.put(
  "/update/:id",
  verifyToken,
  validateRequest(models),
  checkPermission("edit", "Address"),
  addressController.updateAddress
);
router.post(
  "/create",
  verifyToken,
  validateRequest(models),
  checkPermission("create", "Address"),
  addressController.createAddress
);
router.get(
  "/:id",
  verifyToken,
  checkPermission("view_address", "Address"),
  addressController.getAddressById
);
router.get(
  "/",
  verifyToken,
  checkPermission("view_all_addresses", "Address"),
  addressController.getAllAddress
);

module.exports = router;
