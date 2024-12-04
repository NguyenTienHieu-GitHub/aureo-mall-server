const express = require("express");
const router = express.Router();
const shopController = require("../controllers/ShopController");
const { verifyToken } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Shop = require("../models/ShopModel");
const {
  uploadNone,
  fixFilePath,
} = require("../../../shared/middleware/multer");
const models = [Shop];
router.post(
  "/create",
  verifyToken,
  validateRequest(models),
  uploadNone,
  fixFilePath,
  shopController.createShop
);

module.exports = router;
