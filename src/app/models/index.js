const User = require("../models/UserModel.js");
const Role = require("../models/RoleModel.js");
const Permission = require("../models/PermissionModel.js");
const RolePermission = require("../models/RolePermissionModel.js");
const UserRoles = require("../models/UserRoleModel.js");

// Thiết lập mối quan hệ
User.belongsToMany(Role, {
  through: UserRoles,
  foreignKey: "user_id",
  otherKey: "role_id",
});

Role.belongsToMany(User, {
  through: UserRoles,
  foreignKey: "role_id",
  otherKey: "user_id",
});

// Mối quan hệ giữa RolePermission và Permission
RolePermission.belongsTo(Permission, {
  foreignKey: "permission_id",
  as: "permission", // Alias
});

Permission.hasMany(RolePermission, {
  foreignKey: "permission_id",
  as: "role_permissions", // Alias
});

// Mối quan hệ giữa RolePermission và Role
RolePermission.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role", // Alias
});

Role.hasMany(RolePermission, {
  foreignKey: "role_id",
  as: "role_permissions", // Alias
});
