const sequelize = require("../../../config/db/index");
const { DataTypes } = require("sequelize");

const Token = sequelize.define(
  "Tokens",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("createdAt");
        return rawValue
          ? rawValue.toLocaleString("vi-VN", { timeZone: "UTC" })
          : null;
      },
    },
  },
  {
    tableName: "Tokens",
    modelName: "Token",
    timestamps: false,
  }
);

module.exports = Token;
