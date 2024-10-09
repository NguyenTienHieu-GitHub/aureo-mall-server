const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const UserRole = sequelize.define(
  "UserRoles",
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Roles",
        key: "id",
      },
      onDelete: "CASCADE",
      primaryKey: true,
    },
  },
  {
    tableName: "UserRoles",
    modelName: "UserRole",
    timestamps: false,
  }
);

module.exports = UserRole;
