const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const Inventory = sequelize.define(
  "Inventory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Warehouses",
        key: "id",
      },
    },
  },
  {
    tableName: "Inventory",
    modelName: "Inventory",
    timestamps: true,
  }
);

module.exports = Inventory;
