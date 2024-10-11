const express = require("express");
const router = express.Router();
const shopController = require("../controllers/ShopController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Shop = require("../models/ShopModel");

router.post(
  "/create",
  authMiddleware.verifyToken,
  validateRequest(Shop),
  shopController.createShop
);

module.exports = router;
