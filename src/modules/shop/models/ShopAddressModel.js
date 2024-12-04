const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");
const moment = require("moment-timezone");

const ShopAddress = sequelize.define(
  "ShopAddresses",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shopId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Shops",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    provinceCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      reference: {
        model: "Provinces",
        key: "code",
      },
    },
    districtCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      reference: {
        model: "Districts",
        key: "code",
      },
    },
    wardCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      reference: {
        model: "Wards",
        key: "code",
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "ShopAddresses",
    timestamps: true,
  }
);
module.exports = ShopAddress;
