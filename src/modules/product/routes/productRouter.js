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
const Shop = require("../../shop/models/ShopModel");
const {
  uploadNone,
  uploadRating,
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
router.post(
  "/create-rating/:productId",
  verifyToken,
  uploadRating,
  fixFilePath,
  productController.createRatingProduct
);
router.get(
  "/rating/:productId",
  verifyToken,
  productController.getAllRatingOfProduct
);
router.get("/id/:productId", verifyToken, productController.getProductById);
router.get("/:slug", verifyToken, productController.getProductBySlug);
router.get("/private", verifyToken, productController.getAllProductsAdmin);
router.get("/promotions/products", productController.getPromotedProducts);
router.get("/", productController.getAllProducts);

module.exports = router;
