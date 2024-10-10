const express = require("express");
const router = express.Router();
const shopController = require("../controllers/ShopController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");

router.post("/create", authMiddleware.verifyToken, shopController.createShop);

module.exports = router;
