const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");
const { verifyToken } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const Category = require("../models/CategoryModel");

const models = [Category];

router.post(
  "/create",
  verifyToken,
  validateRequest(models),
  categoryController.createCategory
);
router.get("/", verifyToken, categoryController.getAllCategory);

module.exports = router;
