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
const {
  uploadNone,
  uploadProduct,
  fixFilePath,
} = require("../../../shared/middleware/multer");
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
  uploadProduct,
  fixFilePath,
  productController.createProduct
);
router.delete("/delete/:slug", verifyToken, productController.deleteProduct);
router.put(
  "/update/:slug",
  verifyToken,
  validateRequest(models),
  uploadProduct,
  fixFilePath,
  productController.updateProduct
);
router.post(
  "/search-products",
  verifyToken,
  uploadNone,
  productController.searchByNameProduct
);
router.get("/id/:productId", verifyToken, productController.getProductById);
router.get("/:slug", verifyToken, productController.getProductBySlug);
router.get("/", verifyToken, productController.getAllProducts);

module.exports = router;
