const sequelize = require("../../../config/db/index");
const { DataTypes } = require("sequelize");

const BlacklistToken = sequelize.define(
  "BlacklistTokens",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    tableName: "BlacklistTokens",
    modelName: "BlacklistToken",
    timestamps: false,
  }
);

module.exports = BlacklistToken;
