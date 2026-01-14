const { Partner, Drive, Application } = require('../models/Placement');

// Partners
const getPartners = async (req, res) => {
    const { collegeId } = req.query;
    const partners = await Partner.find({ collegeId });
    res.json(partners);
};

const addPartner = async (req, res) => {
    const partner = await Partner.create(req.body);
    res.status(201).json(partner);
};

// Drives
const getDrives = async (req, res) => {
    const { collegeId } = req.query;
    const drives = await Drive.find({ collegeId });
    res.json(drives);
};

const addDrive = async (req, res) => {
    const drive = await Drive.create(req.body);
    res.status(201).json(drive);
};

// Applications
const getApplications = async (req, res) => {
    const { collegeId } = req.query;
    const applications = await Application.find({ collegeId })
        .populate('studentId', 'displayName email rollNo dept year')
        .populate('driveId', 'title company');
    res.json(applications);
};

const updateApplicationStatus = async (req, res) => {
    const application = await Application.findById(req.params.id);
    if (application) {
        application.status = req.body.status || application.status;
        const updated = await application.save();
        res.json(updated);
    } else {
        res.status(404).json({ message: 'Application not found' });
    }
};

module.exports = {
    getPartners,
    addPartner,
    getDrives,
    addDrive,
    getApplications,
    updateApplicationStatus
};
