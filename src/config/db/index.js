const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://postgres:123456@localhost:3000/AureoMall",
  {
    dialect: "postgres",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = sequelize;
