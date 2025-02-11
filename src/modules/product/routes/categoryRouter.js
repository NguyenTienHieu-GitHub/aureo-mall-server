const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");
const { verifyToken } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const { Category, ImageCategory } = require("../models/CategoryModel");
const {
  uploadCategory,
  fixFilePath,
} = require("../../../shared/middleware/multer");
const models = [Category, ImageCategory];

router.delete(
  "/delete/:categoryId",
  verifyToken,
  categoryController.deleteCategoryById
);
router.put(
  "/update/:categoryId",
  verifyToken,
  validateRequest(models),
  uploadCategory,
  fixFilePath,
  categoryController.updateCategoryById
);
router.post(
  "/create",
  verifyToken,
  validateRequest(models),
  uploadCategory,
  fixFilePath,
  categoryController.createCategory
);
router.get("/private", verifyToken, categoryController.getAllCategoryAdmin);
router.get("/", categoryController.getAllCategory);

module.exports = router;
