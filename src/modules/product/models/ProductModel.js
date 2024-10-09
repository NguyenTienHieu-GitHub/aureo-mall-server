const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const Product = sequelize.define(
  "Products",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shopId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Shops",
        key: "id",
      },
    },
    productName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "Products",
    modelName: "Product",
    timestamps: true,
  }
);

module.exports = Product;
