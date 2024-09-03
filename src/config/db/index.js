const Pool = require("pg").Pool;

const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "AureoMall",
  password: process.env.POSTGRE_PASSWORD,
  port: 3000,
});

module.exports = pool;
