const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const { authenticate, optionalAuth, authorize } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, internshipController.getAllInternships);
router.get('/company', authenticate, authorize('company'), internshipController.getCompanyInternships);
router.get('/:id', optionalAuth, internshipController.getInternshipById);
router.post('/', authenticate, authorize('company', 'admin'), internshipController.createInternship);
router.put('/:id', authenticate, authorize('company', 'admin'), internshipController.updateInternship);
router.delete('/:id', authenticate, authorize('company', 'admin'), internshipController.deleteInternship);

module.exports = router;
