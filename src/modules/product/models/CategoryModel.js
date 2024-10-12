const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");

const Category = sequelize.define(
  "Categories",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categories",
        key: "id",
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
  },
  {
    tableName: "Categories",
    modelName: "Category",
    timestamps: true,
  }
);

module.exports = Category;
