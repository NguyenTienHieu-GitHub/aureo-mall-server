const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db/index");

const Permission = sequelize.define(
  "Permission",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    resource: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "permissions",
    timestamps: false,
  }
);

module.exports = Permission;
