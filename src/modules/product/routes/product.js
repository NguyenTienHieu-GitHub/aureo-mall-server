const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Product = require("../models/ProductModel");
const ProductPrice = require("../models/ProductPriceModel");
const ProductMedia = require("../models/ProductMediaModel");
const ProductOption = require("../models/ProductOptionModel");
const Inventory = require("../models/InventoryModel");
const Warehouse = require("../models/WarehouseModel");
const Shop = require("../models/ShopModel");

const models = [Product, ProductPrice, ProductMedia, ProductOption, Inventory];

router.post(
  "/create",
  authMiddleware.verifyToken,
  validateRequest(models),
  productController.createProduct
);
router.delete(
  "/delete/:slug",
  authMiddleware.verifyToken,
  productController.deleteProduct
);
router.put(
  "/update/:slug",
  authMiddleware.verifyToken,
  validateRequest(models),
  productController.updateProduct
);
router.get(
  "/:slug",
  authMiddleware.verifyToken,
  productController.getProductBySlug
);
router.get("/", authMiddleware.verifyToken, productController.getAllProducts);

module.exports = router;
