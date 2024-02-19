const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const secretKey = process.env.TOKEN_SECRET;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.redirect('https://www.ieu.edu.tr/tr');
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.decodedToken = decoded; // Attach the decoded token to the request object
        // console.log(decoded);
        resolve(); // Call the next middleware or route handler
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired', error: err.message });
        } else {
            return res.status(403).json({ message: 'Invalid token', error: err.message });
        }
    }
};

module.exports = verifyToken;
