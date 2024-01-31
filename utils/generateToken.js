const jwt = require('jsonwebtoken');

function generateAccessToken(username) {
    const secretKey = process.env.TOKEN_SECRET;

    return jwt.sign(username, secretKey, { expiresIn: '1y' });
}

module.exports = generateAccessToken;