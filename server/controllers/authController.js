const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'averqon_secret_key', {
        expiresIn: '30d'
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password, bypassMongoAuth } = req.body;

    let user = await User.findOne({ email });

    // Handle Super Admin auto-provisioning if authenticated via Firebase
    if (bypassMongoAuth && email === 'muneeswaran@averqon.in') {
        if (!user) {
            user = await User.create({
                displayName: 'Super Admin',
                email: email,
                password: password || 'firebase_managed', // Placeholder for MongoDB
                role: 'superAdmin',
                status: 'Verified'
            });
        }
        
        res.json({
            _id: user._id,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            collegeId: user.collegeId,
            token: generateToken(user._id)
        });
        return;
    }

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            collegeId: user.collegeId,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { displayName, email, password, role, collegeId, collegeName } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        displayName,
        email,
        password,
        role: 'student', // Strictly allow only student registration via public route
        collegeId,
        collegeName,
        firebaseUid: req.body.firebaseUid
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            collegeId: user.collegeId,
            collegeName: user.collegeName
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { authUser, registerUser, getMe };
