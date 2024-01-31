const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const secretKey = process.env.TOKEN_SECRET;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.decodedToken = decoded; // Attach the decoded token to the request object
        next(); // Call the next middleware or route handler
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token', error: err.message });
    }
};

module.exports = verifyToken;
