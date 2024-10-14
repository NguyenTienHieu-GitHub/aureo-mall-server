const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const ProductCategory = sequelize.define(
  "ProductCategories",
  {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
