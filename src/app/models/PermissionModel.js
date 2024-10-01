const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db/index");

const Permission = sequelize.define(
  "Permissions",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
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
    tableName: "Permissions",
    modelName: "Permission",
    timestamps: false,
  }
);

module.exports = Permission;
