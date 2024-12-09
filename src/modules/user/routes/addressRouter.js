const express = require("express");
const router = express.Router();
const addressController = require("../controllers/UserAddressController");
const {
  verifyToken,
  checkPermission,
} = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const UserAddress = require("../models/UserAddressModel");
const models = [UserAddress];

router.get(
  "/wards/:districtId",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getWardByDistrictID
);
router.get(
  "/districts/:provinceId",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getDistrictsByProvinceID
);
router.get(
  "/provinces",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getProvinces
);

router.get(
  "/my-address",
  verifyToken,
  checkPermission("view_address", "UserAddress"),
  addressController.getMyUserAddress
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
