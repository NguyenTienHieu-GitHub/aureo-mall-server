const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");
const moment = require("moment-timezone");

const Order = sequelize.define(
  "Orders",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shopId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Shops",
        key: "id",
      },
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
    addressId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: "Addresses",
        key: "id",
      },
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Paid",
        "Shop Confirmed",
        "Completed",
        "Failed",
        "Refunded",
        "Expired"
      ),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("createdAt");
        return rawValue
          ? moment
              .utc(rawValue)
              .tz("Asia/Ho_Chi_Minh")
              .format("HH:mm:ss DD/MM/YYYY")
          : null;
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("updatedAt");
        return rawValue
          ? moment
              .utc(rawValue)
              .tz("Asia/Ho_Chi_Minh")
              .format("HH:mm:ss DD/MM/YYYY")
          : null;
      },
    },
  },
  {
    tableName: "Orders",
    timestamps: true,
  }
);

module.exports = Order;
