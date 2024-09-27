// models/userRoles.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db/index");

const UserRoles = sequelize.define(
  "UserRoles",
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
      onDelete: "CASCADE",
      primaryKey: true,
    },
  },
  {
    tableName: "user_roles",
    timestamps: false,
  }
);

module.exports = UserRoles;
