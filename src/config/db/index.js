const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
const result = dotenv.config({ path: envFile });
if (result.error) {
  throw result.error;
}
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = sequelize;
