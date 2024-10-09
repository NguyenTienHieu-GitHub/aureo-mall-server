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
  },
  {
    tableName: "Categories",
    modelName: "Category",
    timestamps: true,
  }
);

module.exports = Category;
