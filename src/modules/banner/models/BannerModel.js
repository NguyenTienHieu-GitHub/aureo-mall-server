const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const Banner = sequelize.define(
  "Banner",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ctaText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ctaUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Banner;
