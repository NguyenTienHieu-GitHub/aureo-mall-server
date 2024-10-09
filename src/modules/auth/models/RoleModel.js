const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const Role = sequelize.define(
  "Roles",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roleName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Roles",
    modelName: "Role",
    timestamps: false,
  }
);

module.exports = Role;
