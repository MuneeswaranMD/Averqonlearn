const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        // AUTH OVERRIDE: Fetch the first available user (Development Mode)
        // This fulfills the request to "remove JWT" for testing.
        const user = await User.findOne({});
        
        if (user) {
            req.user = user;
            next();
        } else {
            // Create a dummy user if DB is empty
            const dummyUser = await User.create({
                name: 'Dev User',
                email: 'dev@averqon.com',
                password: 'password123',
                role: 'student'
            });
            req.user = dummyUser;
            next();
        }
    } catch (error) {
        console.error("Auth Override Error:", error);
        res.status(500).json({ message: 'Auth Error' });
    }
};

const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'collegeAdmin' || req.user.role === 'superAdmin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const superAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superAdmin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a super admin' });
    }
};

module.exports = { protect, admin, superAdmin };
