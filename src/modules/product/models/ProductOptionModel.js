const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const ProductOption = sequelize.define(
  "ProductOptions",
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
    optionName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    optionValue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "ProductOptions",
    timestamps: true,
  }
);

module.exports = ProductOption;
