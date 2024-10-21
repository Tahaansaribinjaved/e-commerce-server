const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Replace with your actual User model

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Split to get the token

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET); // Replace with your actual secret key
        req.user = await User.findById(decoded.id); // Fetch the user by ID
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
