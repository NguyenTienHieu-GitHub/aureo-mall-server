const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");
const moment = require("moment-timezone");

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
      allowNull: true,
    },
  },
  {
    tableName: "ProductOptions",
    modelName: "ProductOption",
    timestamps: false,
  }
);
module.exports = ProductOption;
