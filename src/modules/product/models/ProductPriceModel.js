const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

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
      get() {
        const rawValue = this.getDataValue("discountStartDate");
        return rawValue
          ? rawValue.toLocaleString("vi-VN", { timeZone: "UTC" })
          : null;
      },
    },
    discountEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("discountEndDate");
        return rawValue
          ? rawValue.toLocaleString("vi-VN", { timeZone: "UTC" })
          : null;
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("createdAt");
        return rawValue
          ? rawValue.toLocaleString("vi-VN", { timeZone: "UTC" })
          : null;
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("updatedAt");
        return rawValue
          ? rawValue.toLocaleString("vi-VN", { timeZone: "UTC" })
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
          if (
            !this.discountStartDate ||
            !this.discountEndDate ||
            !this.discountType
          ) {
            throw new Error(
              "Both the discount type, discount start date and discount end date must be provided when the discount price is set"
            );
          }
          if (this.discountEndDate <= this.discountStartDate) {
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
