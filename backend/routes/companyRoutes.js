const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authenticate, authorize('company'));

router.get('/profile', companyController.getProfile);
router.put('/profile', companyController.updateProfile);
router.post('/logo', upload.single('logo'), companyController.uploadLogo);
router.get('/dashboard-stats', companyController.getDashboardStats);
router.get('/applicants', companyController.getApplicants);
router.get('/matched-students', companyController.getMatchedStudents);

module.exports = router;
