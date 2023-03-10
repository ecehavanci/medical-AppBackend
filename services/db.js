const mysql = require('mysql');
require('dotenv').config();
//console.log(process.env);

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


module.exports = conn;