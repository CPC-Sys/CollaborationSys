const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Root2@123',
    database: 'cpc_it'
});

module.exports = mysqlPool;