const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const { authMiddleware } = require("../../../shared/middleware/AuthMiddleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post(
  "/refresh",
  authMiddleware.verifyRefreshToken,
  authController.refreshToken
);
router.post("/logout", authMiddleware.verifyToken, authController.logoutUser);

module.exports = router;
