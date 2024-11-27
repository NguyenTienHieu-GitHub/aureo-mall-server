const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");

const { verifyToken } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");

const Cart = require("../models/CartModel");
const CartItem = require("../models/CartItemModel");
const models = [Cart, CartItem];

router.delete(
  "/items",
  verifyToken,
  validateRequest(models),
  cartController.deleteAllSelected
);

router.delete(
  "/items/:cartItemId",
  verifyToken,
  validateRequest(models),
  cartController.deleteItemInCart
);

router.put(
  "/items/:cartItemId",
  verifyToken,
  validateRequest(models),
  cartController.updateItemInCart
);

router.post(
  "/item",
  verifyToken,
  validateRequest(models),
  cartController.addProductToCart
);
router.get("/", verifyToken, cartController.getAllProductInCart);
module.exports = router;
