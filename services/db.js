const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 20, // Adjust according to your needs
    queueLimit: 0
});

console.log("Database pool created!");

function handleDisconnect(pool) {
    pool.on('error', function (err) {
        console.error('Database error:', err);
    });
}
// Handle disconnects
handleDisconnect(pool);

module.exports = pool;
