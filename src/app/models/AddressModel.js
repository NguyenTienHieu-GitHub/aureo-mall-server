const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db/index");

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    firstName: {
      type: DataTypes.STRING(255),
    },
    lastName: {
      type: DataTypes.STRING(255),
    },
    numberPhone: {
      type: DataTypes.STRING(10),
    },
    province: {
      type: DataTypes.STRING(255),
    },
    district: {
      type: DataTypes.STRING(255),
    },
    ward: {
      type: DataTypes.STRING(255),
    },
    address: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "address",
    timestamps: false,
  }
);

module.exports = Address;
