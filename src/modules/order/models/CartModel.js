const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");
const moment = require("moment-timezone");

const Cart = sequelize.define(
  "Carts",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "Carts",
    timestamps: false,
  }
);

module.exports = Cart;
