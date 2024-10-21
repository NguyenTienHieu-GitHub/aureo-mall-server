const express = require("express");
const router = express.Router();
const addressController = require("../controllers/AddressController");
const {
  verifyToken,
  checkPermission,
} = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const { Address } = require("../models/AddressModel");
const models = [Address];

router.get(
  "/wards/:districtCode",
  verifyToken,
  checkPermission("view_address", "Address"),
  addressController.getWardByDistrictCode
);
router.get(
  "/districts/:provinceCode",
  verifyToken,
  checkPermission("view_address", "Address"),
  addressController.getDistrictsByProvinceCode
);
router.get(
  "/my-address",
  verifyToken,
  checkPermission("view_address", "Address"),
  addressController.getMyAddress
);
router.get(
  "/regions",
  verifyToken,
  checkPermission("view_address", "Address"),
  addressController.getAdministrativeRegion
);
router.get(
  "/units",
  verifyToken,
  checkPermission("view_address", "Address"),
  addressController.getAdministrativeUnit
);
router.get(
  "/wards",
  verifyToken,
  checkPermission("view_address", "Address"),
  addressController.getWards
);
router.get(
  "/districts",
  verifyToken,
  checkPermission("view_address", "Address"),
  addressController.getDistricts
);
router.get(
  "/provinces",
  verifyToken,
  checkPermission("view_address", "Address"),
  addressController.getProvinces
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkPermission("delete", "Address"),
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
