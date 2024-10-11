const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");
const validateRequest = require("../../../shared/middleware/validateRequest");
const User = require("../models/UserModel");
router.post("/register", validateRequest(User), authController.registerUser);
router.post("/login", validateRequest(User), authController.loginUser);
router.post(
  "/refresh",
  authMiddleware.verifyRefreshToken,
  authController.refreshToken
);
router.post("/logout", authMiddleware.verifyToken, authController.logoutUser);

module.exports = router;
