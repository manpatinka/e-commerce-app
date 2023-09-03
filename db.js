const Pool = require('pg').Pool;
require('dotenv').config();

// to use in development
const devConfig = {
    user: 'postgres',
    password: 'postgres',
    database: 'e-shop',
    host: 'localhost',
    port: 5432
};

const pool = new Pool(process.env.NODE_ENV === 'production' ? prodConfig : devConfig);

module.exports = pool;