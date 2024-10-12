const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Category = require("../models/CategoryModel");

const models = [Category];

router.post(
  "/create",
  authMiddleware.verifyToken,
  validateRequest(models),
  categoryController.createCategory
);
router.get("/", authMiddleware.verifyToken, categoryController.getAllCategory);

module.exports = router;
