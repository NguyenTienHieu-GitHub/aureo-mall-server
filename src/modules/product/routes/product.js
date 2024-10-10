const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");

router.post(
  "/create",
  authMiddleware.verifyToken,
  productController.createProduct
);
router.get("/", authMiddleware.verifyToken, productController.getAllProducts);

module.exports = router;
