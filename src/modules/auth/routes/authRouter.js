const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const {
  verifyToken,
  verifyRefreshToken,
} = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const User = require("../models/UserModel");
const models = [User];

router.post("/register", validateRequest(models), authController.registerUser);
router.post("/login", validateRequest(models), authController.loginUser);
router.post("/refresh", verifyRefreshToken, authController.refreshToken);
router.post("/logout", verifyToken, authController.logoutUser);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
