const UserRole = require("../../modules/auth/models/UserRoleModel");
const BlacklistToken = require("../../modules/auth/models/BlacklistTokenModel");
const RolePermission = require("../../modules/user/models/RolePermissionModel");
const Permission = require("../../modules/user/models/PermissionModel");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    try {
      const blacklistedToken = await BlacklistToken.findOne({
        where: { accessToken: token },
      });
      if (blacklistedToken) {
        const decoded = jwt.decode(blacklistedToken.accessToken);
        const exp = decoded.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = exp - currentTime;
        if (timeLeft < 0) {
          await BlacklistToken.destroy({ where: { accessToken: token } });
          console.log(`Removed expired token: ${token}`);
        }
        res.locals.error = "Token has been blacklisted.";
        return res.status(403).json();
      }
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.locals.error = "Token has expired";
          return res.status(401).json();
        }
        req.user = decoded;
        next();
      });
    } catch (err) {
      console.error("Error verifying token:", err);
      res.locals.error = "Internal Server Error";
      return res.status(500).json();
    }
  } else {
    res.locals.error = "You are not authenticated.";
    return res.status(403).json();
  }
};
const verifyRefreshToken = async (req, res, next) => {
  const refreshKey = req.cookies["XSRF-TOKEN"];
  if (!refreshKey) {
    res.locals.error = "Refresh token not found in the cookie";
    return res.status(401).json();
  }
  jwt.verify(refreshKey, process.env.REFRESH_KEY, (err, user) => {
    if (err) {
      res.clearCookie("XSRF-TOKEN");
      res.locals.error = "Refresh token expired or invalid";
      return res.status(403).json();
    }
    next();
  });
};
const checkPermission = (action, resource) => {
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
};

module.exports = {
  verifyToken,
  verifyRefreshToken,
  checkPermission,
};
