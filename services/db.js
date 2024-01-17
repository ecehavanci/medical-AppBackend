const mysql = require('mysql');
require('dotenv').config();

// Function to create a new MySQL connection
function createConnection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT
    });
}

// Function to handle connection errors and attempt reconnection
function handleDisconnect(connection) {
    connection.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            console.log('Reconnecting to the database...');
            reconnect(connection);
        } else {
            throw err;
        }
    });
}

// Function to reconnect to the database
function reconnect(connection) {
    connection = createConnection();
    handleDisconnect(connection);
    connection.connect(function (err) {
        if (err) {
            console.error('Error reconnecting to the database:', err);
            setTimeout(function () {
                reconnect(connection);
            }, 2000); // Attempt to reconnect after 2 seconds
        } else {
            console.log('Reconnected to the database');
        }
    });
}

// Create an initial connection
let connection = createConnection();

// Print "Connected!" when the initial connection is established
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// Handle disconnects and reconnects
handleDisconnect(connection);

module.exports = connection;
