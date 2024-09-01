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

  //verifyToken and Admin
  verifyTokenAndAdminAuth: (req, res, next) => {
    authMiddleware.verifyToken(req, res, () => {
      if (req.user.role_id == 1 || req.user.id === parseInt(req.params.id, 10)) {
        next();
      } else {
        res.status(403).json("You are not allowed to delete other");
      }
    });
  },

};

module.exports = authMiddleware;
