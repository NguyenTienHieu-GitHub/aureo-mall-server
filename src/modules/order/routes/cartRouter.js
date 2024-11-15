const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");

const { verifyToken } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");

const Cart = require("../models/CartModel");
const CartItem = require("../models/CartItemModel");
const CartItemOption = require("../models/CartItemOptionModel");

const models = [Cart, CartItem, CartItemOption];

router.post(
  "/add-to-cart/:productId",
  verifyToken,
  validateRequest(models),
  cartController.addProductToCart
);

router.get("/", verifyToken, cartController.getAllProductInCart);
module.exports = router;
