const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.post('/apply', authenticate, authorize('student'), applicationController.applyToOpportunity);
router.get('/my-applications', authenticate, authorize('student'), applicationController.getMyApplications);
router.put('/:id/status', authenticate, authorize('company', 'admin'), applicationController.updateApplicationStatus);
router.delete('/:id', authenticate, authorize('student'), applicationController.withdrawApplication);

module.exports = router;
