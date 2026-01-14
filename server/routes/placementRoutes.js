const express = require('express');
const router = express.Router();
const { 
    getPartners, addPartner, 
    getDrives, addDrive, 
    getApplications, updateApplicationStatus 
} = require('../controllers/placementController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/partners', protect, getPartners);
router.post('/partners', protect, admin, addPartner);

router.get('/drives', protect, getDrives);
router.post('/drives', protect, admin, addDrive);

router.get('/applications', protect, getApplications);
router.put('/applications/:id', protect, admin, updateApplicationStatus);

module.exports = router;
