const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db/index");
const moment = require("moment-timezone");

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
        const rawValue = this.getDataValue("expiresAt");
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
    tableName: "Tokens",
    timestamps: false,
  }
);

module.exports = Token;
