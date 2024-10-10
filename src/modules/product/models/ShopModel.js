const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const Shop = sequelize.define(
  "Shops",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shopName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9]+$/,
      },
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
      defaultValue: null,
    },
    logo: {
      type: DataTypes.STRING,
      defaultValue: null,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
        defaultValue: null,
      },
    },
  },
  {
    tableName: "Shops",
    modelName: "Shop",
    timestamps: true,
  }
);

module.exports = Shop;
