const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const ProductPrice = sequelize.define(
  "ProductPrices",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    discountStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    discountEndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "ProductPrices",
    modelName: "ProductPrice",
    timestamps: false,
  }
);

module.exports = ProductPrice;
