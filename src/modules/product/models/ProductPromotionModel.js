const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const ProductPromotion = sequelize.define(
  "ProductPromotions",
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
    promotionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Promotions",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ProductPromotion;
