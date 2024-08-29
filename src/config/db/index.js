const Pool = require('pg').Pool;

const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    port: 3000,
    password: process.env.POSTGRE_PASSWORD,
    database: 'AureoMall',
});

module.exports = pool;