const express = require("express");
const router = express.Router();
const authController = require("../app/controller/AuthController");
const authMiddleware = require("../app/middleware/AuthMiddleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.requestRefreshToken);
router.post("/logout", authMiddleware.verifyToken, authController.logoutUser);

module.exports = router;
