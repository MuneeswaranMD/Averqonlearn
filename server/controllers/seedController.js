const User = require('../models/User');
const College = require('../models/College');
const Department = require('../models/Department');
const { Subject, Content } = require('../models/Subject');
const Exam = require('../models/Exam');
const Batch = require('../models/Batch');
const { Partner, Drive } = require('../models/Placement');

// @desc    Seed Demo Data for MongoDB
// @route   POST /api/academic/seed
// @access  Public (for initial setup)
const seedData = async (req, res) => {
    try {
        console.log('Starting seed process...');
        
        // 1. Create College
        let college = await College.findOne({ code: 'AIT' });
        if (!college) {
            college = await College.create({
                name: 'Averqon Institute of Technology',
                code: 'AIT',
                location: 'Chennai'
            });
            console.log('College created');
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
        console.log('Departments checked/created');

        const aitDept = await Department.findOne({ collegeId: college._id, name: 'Computer Science' });

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
                displayName: 'Dr. Sarah Smith', 
                email: 'faculty@ait.edu', 
                password: 'password123', 
                role: 'faculty', 
                collegeId: college._id, 
                collegeName: college.name,
                dept: aitDept.name
            },
            { 
                displayName: 'Rahul Sharma', 
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

        let facultyUser;

        for (const u of demoUsers) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                user = await User.create(u);
                console.log(`User created: ${u.email}`);
            }
            if (u.role === 'faculty') facultyUser = user;
        }

        // 4. Create Batch
        let batch = await Batch.findOne({ name: 'CSE - 2025 - Section A' });
        if (!batch) {
            batch = await Batch.create({
                name: 'CSE - 2025 - Section A',
                collegeId: college._id,
                department: 'Computer Science',
                year: '3',
                section: 'A',
                facultyIds: facultyUser ? [facultyUser._id] : []
            });
            console.log('Batch created');
        }

        // 5. Create Subjects & Content
        const subjects = [
            {
                title: 'Data Structures & Algorithms',
                dept: 'Computer Science',
                year: '3',
                description: 'Comprehensive guide to DSA using C++ and Java',
                thumbnail: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
            },
            {
                title: 'Full Stack Web Development',
                dept: 'Computer Science',
                year: '3',
                description: 'MERN Stack - MongoDB, Express, React, Node',
                thumbnail: 'https://img.freepik.com/free-vector/web-development-programmer-engineering-coding-website-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-cartoon-illustration_107791-3863.jpg'
            }
        ];

        for (const s of subjects) {
            let subject = await Subject.findOne({ title: s.title, collegeId: college._id });
            if (!subject) {
                subject = await Subject.create({
                    ...s,
                    collegeId: college._id,
                    instructorId: facultyUser?._id,
                    instructorName: facultyUser?.displayName
                });
                console.log(`Subject created: ${s.title}`);

                // Add Dummy Content
                 await Content.create({
                    subjectId: subject._id,
                    title: `Introduction to ${s.title}`,
                    type: 'video',
                    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
                    description: 'Lecture 1 - Overview',
                    duration: '45 mins',
                    unit: 'Unit 1'
                });
                await Content.create({
                    subjectId: subject._id,
                    title: `${s.title} Syllabus`,
                    type: 'note',
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    description: 'Syllabus copy PDF',
                    size: '2 MB',
                    unit: 'Syllabus'
                });
            }
        }

        // 6. Create Exams
        const examTitle = 'Mid-Term Assessment: DSA';
        let exam = await Exam.findOne({ title: examTitle });
        if (!exam) {
            await Exam.create({
                title: examTitle,
                category: 'Technical',
                collegeId: college._id,
                createdBy: facultyUser?._id || college._id, // Fallback
                dept: 'Computer Science',
                year: '3',
                scheduledDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
                duration: 60,
                status: 'Active',
                questions: [
                    {
                        type: 'MCQ',
                        text: 'What is the time complexity of binary search?',
                        options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
                        correctAnswer: 'O(log n)',
                        points: 2
                    },
                    {
                        type: 'MCQ',
                        text: 'Which data structure is LIFO?',
                        options: ['Queue', 'Stack', 'Array', 'Linked List'],
                        correctAnswer: 'Stack',
                        points: 2
                    }
                ]
            });
            console.log('Exam created');
        }

        // 7. Create Placements
        const partnerName = 'Zoho Corporation';
        let partner = await Partner.findOne({ name: partnerName });
        if (!partner) {
            partner = await Partner.create({
                name: partnerName,
                collegeId: college._id,
                industry: 'SaaS',
                location: 'Chennai',
                website: 'https://www.zoho.com'
            });
            console.log('Partner created');

            await Drive.create({
                title: 'Software Developer Hiring 2025',
                company: partnerName,
                collegeId: college._id,
                date: new Date(Date.now() + 86400000 * 5),
                location: 'Chennai (Potheri Campus)',
                package: '8.5 LPA',
                eligibility: 'No current backlogs',
                status: 'Upcoming'
            });
             console.log('Drive created');
        }

        res.json({ message: 'Real demo data seeded successfully!' });
    } catch (error) {
        console.error('Seeding Error:', error);
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
};

module.exports = { seedData };
