const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { verifyToken } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Product = require("../models/ProductModel");
const ProductPrice = require("../models/ProductPriceModel");
const ProductMedia = require("../models/ProductMediaModel");
const ProductOption = require("../models/ProductOptionModel");
const Inventory = require("../models/InventoryModel");
const ProductCategory = require("../models/ProductCategoryModel");
const Warehouse = require("../models/WarehouseModel");
const Shop = require("../models/ShopModel");

const models = [
  Product,
  ProductPrice,
  ProductMedia,
  ProductOption,
  Inventory,
  ProductCategory,
];

router.post(
  "/create",
  verifyToken,
  validateRequest(models),
  productController.createProduct
);
router.delete("/delete/:slug", verifyToken, productController.deleteProduct);
router.put(
  "/update/:slug",
  verifyToken,
  validateRequest(models),
  productController.updateProduct
);
router.get("/:slug", verifyToken, productController.getProductBySlug);
router.get("/", verifyToken, productController.getAllProducts);

module.exports = router;
