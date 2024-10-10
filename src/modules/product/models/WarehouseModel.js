const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const Warehouse = sequelize.define(
  "Warehouse",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    warehouseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Warehouses",
    modelName: "Warehouse",
    timestamps: true,
  }
);

module.exports = Warehouse;
