const userModel = require("../../app/models/UserModel");
const pool = require("../../config/db/index");
const authController = require("../../app/controller/AuthController");
const jwt = require("jsonwebtoken");

const authMiddleware = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      // Tách token
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          console.error("JWT verification error:", err);
          return res.status(403).json({ message: "Token is not valid" });
        }
        req.user = decoded;
        next();
      });
    } else {
      return res.status(403).json({ message: "You are not authenticated" });
    }
  },

  checkPermission: (action, resource) => {
    return async (req, res, next) => {
      try {
        const userId = req.user.user_id;
        const result = await pool.query(userModel.checkPermission, [
          userId,
          action,
          resource,
        ]);
        // console.log(result);
        if (result.rows[0].count > 0) {
          // Người dùng có quyền
          next();
        } else {
          // Người dùng không có quyền
          return res.status(403).json({
            message: "Permission denied",
          });
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    };
  },
};

module.exports = {
  authMiddleware,
};
