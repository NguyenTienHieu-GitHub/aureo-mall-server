const UserRole = require("../../modules/auth/models/UserRoleModel");
const RolePermission = require("../../modules/user/models/RolePermissionModel");
const Permission = require("../../modules/user/models/PermissionModel");
const jwt = require("jsonwebtoken");

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const refreshKey = req.cookies["XSRF-TOKEN"];

    if (!refreshKey) {
      res.locals.message = "Please log in again.";
      res.locals.error =
        "RefreshKey is missing. AccessKey will be invalidated.";
      return res.status(403).json();
    }
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          console.error("JWT verification error:", err);
          res.locals.message = "Token has expired.";
          res.locals.error = {
            message: "Token is not valid.",
            originalError: err.message,
          };
          return res.status(401).json();
        }
        req.user = decoded;
        next();
      });
    } else {
      res.locals.message = "You are not authenticated.";
      res.locals.error = "Authorization header is missing.";
      return res.status(403).json();
    }
  },
  verifyRefreshToken: (req, res, next) => {
    const refreshKey = req.cookies["XSRF-TOKEN"];
    if (!refreshKey) {
      res.locals.message = "Refresh token not found.";
      res.locals.error = "Refresh token not found in the cookie";
      return res.status(401).json();
    }
    jwt.verify(refreshKey, process.env.REFRESH_KEY, (err, user) => {
      if (err) {
        res.clearCookie("XSRF-TOKEN");
        res.locals.message = "Refresh token expired or invalid";
        res.locals.error = "Please log in again.";
        return res.status(403).json();
      }
      next();
    });
  },

  checkPermission: (action, resource) => {
    return async (req, res, next) => {
      try {
        const userId = req.user.id;
        if (!userId) {
          res.locals.message = "You are not authenticated";
          res.locals.error = "You need to login";
          return res.status(400).json();
        }
        const user = await UserRole.findByPk(userId);
        if (!user) {
          res.locals.message = "User not found";
          res.locals.error = "User not found in the database";
          return res.status(404).json();
        }
        const roleId = user.roleId;
        const permission = await Permission.findOne({
          where: {
            action: action,
            resource: resource,
          },
          attributes: ["id"],
        });
        if (!permission) {
          res.locals.message = "Permission not found for the provided";
          res.locals.error =
            "Permission not found for the provided action and resource";
          return res.status(403).json();
        }
        const rolePermission = await RolePermission.findOne({
          where: {
            roleId: roleId,
            permissionId: permission.id,
          },
        });

        if (rolePermission) {
          next();
        } else {
          res.locals.message = "Permission denied";
          res.locals.error = "User does not have permission";
          return res.status(403).json();
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        res.locals.message = "Internal Server Error";
        res.locals.error = error.message;
        return res.status(500).json();
      }
    };
  },
};

module.exports = {
  authMiddleware,
};
