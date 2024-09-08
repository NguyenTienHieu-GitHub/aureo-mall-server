const userModel = require("../../app/models/UserModel");
const pool = require("../../config/db/index");
const middlewareWrapper = require("cors");
const jwt = require("jsonwebtoken");

const authMiddleware = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
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

  checkPermission: (requiredPermission) => {
    return async (req, res, next) => {
      try {
        const userId = req.user.id; // Lấy ID người dùng từ thông tin giải mã token

        const result = await pool.query(userModel.checkPermission, [
          userId,
          requiredPermission,
        ]);

        if (result.rows.length > 0) {
          // Người dùng có quyền
          next();
        } else {
          // Người dùng không có quyền
          return res.status(403).json({ message: "Permission denied" });
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
