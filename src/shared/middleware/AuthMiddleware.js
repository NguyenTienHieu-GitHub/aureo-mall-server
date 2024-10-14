const UserRole = require("../../modules/auth/models/UserRoleModel");
const BlacklistToken = require("../../modules/auth/models/BlacklistTokenModel");
const RolePermission = require("../../modules/user/models/RolePermissionModel");
const Permission = require("../../modules/user/models/PermissionModel");
const setResponseLocals = require("./setResponseLocals");
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
        return setResponseLocals({
          res,
          statusCode: 401,
          errorCode: "TOKEN_BLACKLISTED",
          errorMessage: "Token has been blacklisted",
        });
      }
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return setResponseLocals({
            res,
            statusCode: 401,
            errorCode: "TOKEN_EXPIRED",
            errorMessage: "Token has expired",
          });
        }
        req.user = decoded;
        next();
      });
    } catch (error) {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  } else {
    return setResponseLocals({
      res,
      statusCode: 401,
      errorCode: "TOKEN_INVALID",
      errorMessage: "You are not authenticated",
    });
  }
};
const verifyRefreshToken = (req, res, next) => {
  const refreshKey = req.cookies["XSRF-TOKEN"];
  if (!refreshKey) {
    return setResponseLocals({
      res,
      statusCode: 401,
      errorCode: "TOKEN_NOT_FOUND",
      errorMessage: "Token not found in the cookie",
    });
  }
  jwt.verify(refreshKey, process.env.REFRESH_KEY, (err, user) => {
    if (err) {
      res.clearCookie("XSRF-TOKEN");
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_EXPIRED",
        errorMessage: "Token expired or invalid",
      });
    }
    next();
  });
};
const checkPermission = (action, resource) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return setResponseLocals({
          res,
          statusCode: 401,
          errorCode: "TOKEN_INVALID",
          errorMessage: "You are not authenticated",
        });
      }
      const user = await UserRole.findByPk(userId);
      if (!user) {
        return setResponseLocals({
          res,
          statusCode: 404,
          errorCode: "USER_NOT_FOUND",
          errorMessage: "User not found in the database",
        });
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
        return setResponseLocals({
          res,
          statusCode: 403,
          errorCode: "PERMISSION_NOT_FOUND",
          errorMessage:
            "Permission not found for the provided action and resource",
        });
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
        return setResponseLocals({
          res,
          statusCode: 403,
          errorCode: "PERMISSION_DENIED",
          errorMessage: "User does not have permission",
        });
      }
    } catch (error) {
      console.error(error);
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  };
};

module.exports = {
  verifyToken,
  verifyRefreshToken,
  checkPermission,
};
