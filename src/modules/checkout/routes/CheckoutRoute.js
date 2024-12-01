const express = require("express");
const router = express.Router();
const CheckoutController = require("../controller/CheckoutController");
const { verifyToken } = require("../../../shared/middleware/AuthMiddleware");

router.post("/create", verifyToken, CheckoutController.CreatePayment);

router.post("/notify", CheckoutController.handleNotification);

router.get("/:paymentId", verifyToken, CheckoutController.getPaymentById);

module.exports = router;
