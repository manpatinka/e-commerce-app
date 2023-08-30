const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "e-commerce-app"
  });
  
  module.exports = pool;