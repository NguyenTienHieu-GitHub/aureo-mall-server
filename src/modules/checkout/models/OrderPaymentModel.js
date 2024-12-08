const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const OrderPayment = sequelize.define(
  "OrderPayments",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Payments",
        key: "id",
      },
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "OrderPayments",
    timestamps: false,
  }
);
module.exports = OrderPayment;
