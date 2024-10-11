const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Product = require("../models/ProductModel");

router.post(
  "/create",
  authMiddleware.verifyToken,
  validateRequest(Product),
  productController.createProduct
);
router.get(
  "/",
  authMiddleware.verifyToken,
  validateRequest(Product),
  productController.getAllProducts
);

module.exports = router;
