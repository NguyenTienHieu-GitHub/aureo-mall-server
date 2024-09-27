const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db/index");

const RolePermission = sequelize.define(
  "RolePermission",
  {
    role_id: {
      type: DataTypes.BIGINT,
      references: {
        model: "roles",
        key: "id",
      },
      onDelete: "CASCADE",
      primaryKey: true,
    },
    permission_id: {
      type: DataTypes.BIGINT,
      references: {
        model: "permissions",
        key: "id",
      },
      onDelete: "CASCADE",
      primaryKey: true,
    },
  },
  {
    tableName: "role_permissions",
    timestamps: false,
  }
);

module.exports = RolePermission;
