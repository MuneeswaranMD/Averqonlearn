const User = require('../models/User');
const College = require('../models/College');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
            role: user.role,
            collegeId: user.collegeId,
            themeId: user.themeId,
            darkMode: user.darkMode,
            token: generateToken(user._id)
        });
        return;
    }

    if (user) {
        // Priority 1: Check individual password
        if (await user.matchPassword(password)) {
            res.json({
                _id: user._id,
                displayName: user.displayName,
                email: user.email,
                role: user.role,
                collegeId: user.collegeId,
                themeId: user.themeId,
                darkMode: user.darkMode,
                token: generateToken(user._id)
            });
            return;
        }

        // Priority 2: Check common college password
        let collegeDefaultThemeId = 'indigo';
        if (user.collegeId) {
            const college = await College.findById(user.collegeId);
            if (college) collegeDefaultThemeId = college.defaultThemeId;
            
            if (college) {
                let isCommonMatch = false;

                console.log('Login attempt with common password. Role:', user.role);
                
                if (user.role === 'student' && college.commonPassword) {
                    isCommonMatch = await bcrypt.compare(password, college.commonPassword);
                } else if (user.role === 'faculty' && college.commonFacultyPassword) {
                    console.log('Checking faculty common pass. Exists? ', !!college.commonFacultyPassword);
                    isCommonMatch = await bcrypt.compare(password, college.commonFacultyPassword);
                } else if ((user.role === 'placement' || user.role === 'tpo') && college.commonPlacementPassword) {
                     console.log('Checking placement common pass. Exists? ', !!college.commonPlacementPassword);
                    isCommonMatch = await bcrypt.compare(password, college.commonPlacementPassword);
                }
                
                console.log('Common Match Result:', isCommonMatch);
                
                if (isCommonMatch) {
                    res.json({
                        _id: user._id,
                        displayName: user.displayName,
                        email: user.email,
                        role: user.role,
                        collegeId: user.collegeId,
                        themeId: user.themeId,
                        darkMode: user.darkMode,
                        collegeDefaultThemeId,
                        token: generateToken(user._id)
                    });
                    return;
                }
            }
        }
    }

    res.status(401).json({ message: 'Invalid email or password' });
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
            collegeName: user.collegeName,
            themeId: user.themeId,
            darkMode: user.darkMode,
            collegeDefaultThemeId: (await College.findById(user.collegeId))?.defaultThemeId || 'indigo'
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user settings
// @route   PUT /api/auth/settings
// @access  Private
const updateSettings = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.themeId = req.body.themeId || user.themeId;
        user.darkMode = req.body.darkMode !== undefined ? req.body.darkMode : user.darkMode;

        const updatedUser = await user.save();
        res.json({
            themeId: updatedUser.themeId,
            darkMode: updatedUser.darkMode
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { authUser, registerUser, getMe, updateSettings };
