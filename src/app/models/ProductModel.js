const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db/index");

const Product = sequelize.define(
  "Products",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Products",
    modelName: "Product",
    timestamps: true,
  }
);

module.exports = Product;
