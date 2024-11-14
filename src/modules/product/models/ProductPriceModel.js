const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");
const moment = require("moment-timezone");

const ProductPrice = sequelize.define(
  "ProductPrices",
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
    originalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discountPrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discountType: {
      type: DataTypes.ENUM("amount", "percent"),
      allowNull: true,
    },
    discountStartDate: {
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
    discountEndDate: {
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
    finalPrice: {
      type: DataTypes.VIRTUAL,
      get() {
        const discountPrice = this.getDataValue("discountPrice");
        const discountType = this.getDataValue("discountType");
        const originalPrice = this.getDataValue("originalPrice");
        const discountStartDate = this.getDataValue("discountStartDate");
        const discountEndDate = this.getDataValue("discountEndDate");
        const currentDate = new Date();
        if (
          discountPrice &&
          discountStartDate <= currentDate &&
          discountEndDate >= currentDate
        ) {
          if (discountType === "percent") {
            return originalPrice - originalPrice * (discountPrice / 100);
          } else if (discountType === "amount") {
            return originalPrice - discountPrice;
          }
        }
        return originalPrice;
      },
    },
  },
  {
    tableName: "ProductPrices",
    timestamps: true,
    validate: {
      discountDatesCheck() {
        if (this.discountPrice) {
          if (!this.discountStartDate || !this.discountEndDate) {
            throw new Error(
              "Both the discount type, discount start date and discount end date must be provided when the discount price is set"
            );
          }

          const startDate = new Date(this.discountStartDate);
          const endDate = new Date(this.discountEndDate);

          if (endDate > startDate) {
            throw new Error(
              "Discount end date must be greater than the start date"
            );
          }
        }
      },
    },
  }
);

module.exports = ProductPrice;
