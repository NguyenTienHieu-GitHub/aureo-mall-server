const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");
const moment = require("moment-timezone");

const RolePermission = sequelize.define(
  "RolePermissions",
  {
    roleId: {
      type: DataTypes.BIGINT,
      references: {
        model: "Roles",
        key: "id",
      },
      onDelete: "CASCADE",
      primaryKey: true,
    },
    permissionId: {
      type: DataTypes.BIGINT,
      references: {
        model: "Permissions",
        key: "id",
      },
      onDelete: "CASCADE",
      primaryKey: true,
    },
  },
  {
    tableName: "RolePermissions",
    modelName: "RolePermission",
    timestamps: false,
  }
);

module.exports = RolePermission;
