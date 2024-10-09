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
    name: {
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
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[0-9]+$/,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
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
