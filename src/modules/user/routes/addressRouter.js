const express = require("express");
const router = express.Router();
const addressController = require("../controllers/UserAddressController");
const {
  verifyToken,
  checkPermission,
} = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const { UserAddress } = require("../models/UserAddressModel");
const models = [UserAddress];

router.get(
  "/wards/:districtCode",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getWardByDistrictCode
);
router.get(
  "/districts/:provinceCode",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getDistrictsByProvinceCode
);
router.get(
  "/my-address",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getMyUserAddress
);
router.get(
  "/regions",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getAdministrativeRegion
);
router.get(
  "/units",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getAdministrativeUnit
);
router.get(
  "/wards",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getWards
);
router.get(
  "/districts",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getDistricts
);
router.get(
  "/provinces",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getProvinces
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkPermission("delete", "UserAddress"),
  addressController.deleteUserAddress
);
router.put(
  "/update/:id",
  verifyToken,
  validateRequest(models),
  checkPermission("edit", "UserAddress"),
  addressController.updateUserAddress
);
router.post(
  "/create",
  verifyToken,
  validateRequest(models),
  checkPermission("create", "UserAddress"),
  addressController.createUserAddress
);
router.get(
  "/:id",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getUserAddressById
);
router.get(
  "/",
  verifyToken,
  checkPermission("view_all_addresses", "UserAddress"),
  addressController.getAllUserAddress
);

module.exports = router;
