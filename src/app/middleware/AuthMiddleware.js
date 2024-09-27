const UserRole = require("../../app/models/UserRoleModel");
const RolePermission = require("../../app/models/RolePermissionModel");
const Permission = require("../../app/models/PermissionModel");
const jwt = require("jsonwebtoken");

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          console.error("JWT verification error:", err);
          return res.status(401).json({ message: "Token is not valid" });
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

        const user = await UserRole.findByPk(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const roleId = user.role_id;

        const rolePermission = await RolePermission.findOne({
          where: {
            role_id: roleId,
            permission_id: (
              await Permission.findOne({
                where: {
                  action: action,
                  resource: resource,
                },
                attributes: ["id"],
              })
            ).id,
          },
        });

        if (rolePermission) {
          next();
        } else {
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
