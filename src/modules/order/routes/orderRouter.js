const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const { verifyToken } = require("../../../shared/middleware/AuthMiddleware");

router.post("/create", verifyToken, orderController.createOrder);

module.exports = router;
