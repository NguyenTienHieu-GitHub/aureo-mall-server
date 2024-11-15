const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");
const moment = require("moment-timezone");

const CartItemOption = sequelize.define(
  "CartItemOptions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "CartItems",
        key: "id",
      },
    },
    optionQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: "CartItemOptions",
    timestamps: false,
  }
);

module.exports = CartItemOption;
