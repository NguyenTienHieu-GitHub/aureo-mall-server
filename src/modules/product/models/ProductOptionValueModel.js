const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const ProductOptionValue = sequelize.define(
  "ProductOptionValues",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    optionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ProductOptions",
        key: "id",
      },
    },
    optionValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "ProductOptionValues",
    timestamps: false,
  }
);
module.exports = ProductOptionValue;
