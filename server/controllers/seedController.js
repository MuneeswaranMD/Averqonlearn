const User = require('../models/User');
const College = require('../models/College');
const Department = require('../models/Department');

// @desc    Seed Demo Data for MongoDB
// @route   POST /api/academic/seed
// @access  Public (for initial setup)
const seedData = async (req, res) => {
    try {
        // 1. Create College
        let college = await College.findOne({ code: 'AIT' });
        if (!college) {
            college = await College.create({
                name: 'Averqon Institute of Technology',
                code: 'AIT',
                location: 'Chennai'
            });
        }

        // 2. Create Departments
        const depts = ['Computer Science', 'Electronic Engineering', 'Information Technology'];
        for (const d of depts) {
            const exists = await Department.findOne({ name: d, collegeId: college._id });
            if (!exists) {
                await Department.create({
                    name: d,
                    collegeId: college._id,
                    head: 'Dr. Sample'
                });
            }
        }

        const aitDept = await Department.findOne({ collegeId: college._id });

        // 3. Create Demo Users
        const demoUsers = [
            { 
                displayName: 'Institutional Admin', 
                email: 'admin@ait.edu', 
                password: 'password123', 
                role: 'collegeAdmin', 
                collegeId: college._id, 
                collegeName: college.name 
            },
            { 
                displayName: 'Faculty Member', 
                email: 'faculty@ait.edu', 
                password: 'password123', 
                role: 'faculty', 
                collegeId: college._id, 
                collegeName: college.name,
                dept: aitDept.name
            },
            { 
                displayName: 'Student Demo', 
                email: 'student@ait.edu', 
                password: 'password123', 
                role: 'student', 
                collegeId: college._id, 
                collegeName: college.name,
                dept: aitDept.name,
                year: '3',
                rollNo: '21CS001'
            },
            { 
                displayName: 'Placement Officer', 
                email: 'tpo@ait.edu', 
                password: 'password123', 
                role: 'placement', 
                collegeId: college._id, 
                collegeName: college.name 
            }
        ];

        for (const u of demoUsers) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
            }
        }

        res.json({ message: 'Demo data seeded successfully' });
    } catch (error) {
        console.error('Seeding Error:', error);
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
};

module.exports = { seedData };
