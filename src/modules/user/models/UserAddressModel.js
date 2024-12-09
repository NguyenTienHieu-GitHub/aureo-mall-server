const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");
const moment = require("moment-timezone");

const UserAddress = sequelize.define(
  "UserAddresses",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    addressType: {
      type: DataTypes.ENUM("HOME", "OFFICE"),
      allowNull: false,
      defaultValue: "HOME",
    },
    provinceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    districtId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    wardCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullAddress: {
      type: DataTypes.STRING,
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
    tableName: "UserAddresses",
    modelName: "UserAddress",
    timestamps: true,
  }
);

module.exports = UserAddress;
