const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");
const moment = require("moment-timezone");

const Promotion = sequelize.define(
  "Promotions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Discount", "BestSeller", "WholeSeller"),
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    condition: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      set(value) {
        const [time, date] = value.split(" ");
        const [hour, minute, second] = time.split(":");
        const [day, month, year] = date.split("/");

        const dateTime = moment.tz(
          `${year}-${month}-${day} ${hour}:${minute}:${second}`,
          "YYYY-MM-DD HH:mm:ss",
          "Asia/Ho_Chi_Minh"
        );

        this.setDataValue("discountStartDate", dateTime.utc().toDate());
      },
      get() {
        const rawValue = this.getDataValue("discountStartDate");
        return rawValue
          ? moment
              .utc(rawValue)
              .tz("Asia/Ho_Chi_Minh")
              .format("HH:mm:ss DD/MM/YYYY")
          : null;
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      set(value) {
        const [time, date] = value.split(" ");
        const [hour, minute, second] = time.split(":");
        const [day, month, year] = date.split("/");

        const dateTime = moment.tz(
          `${year}-${month}-${day} ${hour}:${minute}:${second}`,
          "YYYY-MM-DD HH:mm:ss",
          "Asia/Ho_Chi_Minh"
        );

        this.setDataValue("discountEndDate", dateTime.utc().toDate());
      },
      get() {
        const rawValue = this.getDataValue("discountEndDate");
        return rawValue
          ? moment
              .utc(rawValue)
              .tz("Asia/Ho_Chi_Minh")
              .format("HH:mm:ss DD/MM/YYYY")
          : null;
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Promotion;
