const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const ProductMedia = sequelize.define(
  "ProductMedia",
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
    mediaType: {
      type: DataTypes.ENUM("image", "video"),
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "ProductMedia",
    timestamps: true,
  }
);

module.exports = ProductMedia;
