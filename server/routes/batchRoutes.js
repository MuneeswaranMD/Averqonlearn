const express = require('express');
const router = express.Router();
const { getBatches, createBatch, updateBatch, deleteBatch, populateBatch } = require('../controllers/batchController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getBatches) // Faculty can also view Batches (TODO: refine middleware if needed)
    .post(protect, admin, createBatch);

router.route('/:id')
    .put(protect, admin, updateBatch)
    .delete(protect, admin, deleteBatch);

router.route('/:id/populate')
    .post(protect, admin, populateBatch);

module.exports = router;
