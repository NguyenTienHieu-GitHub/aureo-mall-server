const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db/index");

const ProductCategory = sequelize.define(
  "ProductCategories",
  {
    productId: {
      type: DataTypes.UUID,
      references: {
        model: "Products",
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Categories",
        key: "id",
      },
    },
  },
  {
    tableName: "ProductCategories",
    modelName: "ProductCategory",
    timestamps: false,
  }
);

module.exports = ProductCategory;
