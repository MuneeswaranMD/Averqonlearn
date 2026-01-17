const User = require('../models/User');
const Batch = require('../models/Batch');

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private/Admin
const getUsersByRole = async (req, res) => {
    const { role } = req.params;
    const { collegeId } = req.query;

    const query = { role };
    if (collegeId) query.collegeId = collegeId;

    // Strict Filtering: If requester is a Faculty, ONLY show students from their assigned batches
    if (req.user && req.user.role === 'faculty' && role === 'student') {
        const myBatches = await Batch.find({ 
            collegeId, 
            facultyIds: req.user._id,
            isActive: true 
        });

        const allowedStudentIds = myBatches.reduce((acc, batch) => {
            return acc.concat(batch.studentIds);
        }, []);

        // Flatten and unique
        query._id = { $in: [...new Set(allowedStudentIds)] };
    }

    const users = await User.find(query);
    res.json(users);
};

// @desc    Add a user
// @route   POST /api/users
// @access  Private/Admin
const addUser = async (req, res) => {
    const { displayName, email, password, role, collegeId, collegeName, dept, year, rollNo } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        displayName,
        email,
        password: password || 'password123',
        role,
        collegeId,
        collegeName,
        dept,
        year,
        rollNo
    });

    // Auto-assign to batches based on Dept and Year
    if (user && role === 'student' && collegeId) {
        try {
            const query = { collegeId, isActive: true };
            
            // Create flexible regex queries if dept/year are provided
            if (dept) {
                // Matches "CSE", "cse", "CSE Dept", "Computer Science", etc. roughly
                // Use a simple partial match or exact case-insensitive match
                query.department = { $regex: new RegExp(dept, 'i') }; 
            }
            if (year) {
                // Matches "1", "1st", "Year 1", etc.
                // Just use Regex for partial because formats widely vary
                query.year = { $regex: new RegExp(year, 'i') };
            }

            // Only run if at least dept or year is present to avoid adding to "all-batch" accidentally
            if (dept || year) {
                await Batch.updateMany(
                    query,
                    { $addToSet: { studentIds: user._id } }
                );
            }
        } catch (err) {
            console.error("Error auto-assigning student to batch:", err);
        }
    }

    res.status(201).json(user);
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.displayName = req.body.displayName || user.displayName;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.dept = req.body.dept || user.dept;
        user.year = req.body.year || user.year;
        user.rollNo = req.body.rollNo || user.rollNo;
        user.status = req.body.status || user.status;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getUsersByRole, addUser, updateUser, deleteUser };
