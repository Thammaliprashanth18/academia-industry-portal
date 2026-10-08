const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate, optionalAuth, authorize } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, jobController.getAllJobs);
router.get('/company', authenticate, authorize('company'), jobController.getCompanyJobs);
router.get('/:id', optionalAuth, jobController.getJobById);
router.post('/', authenticate, authorize('company', 'admin'), jobController.createJob);
router.put('/:id', authenticate, authorize('company', 'admin'), jobController.updateJob);
router.delete('/:id', authenticate, authorize('company', 'admin'), jobController.deleteJob);

module.exports = router;
