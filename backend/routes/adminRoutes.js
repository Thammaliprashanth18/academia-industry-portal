const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate, authorize('admin'));

router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

router.get('/companies', adminController.getAllCompanies);
router.put('/companies/:id/verify', adminController.verifyCompany);

router.get('/skills', adminController.manageSkills);
router.post('/skills', adminController.addSkill);
router.delete('/skills/:id', adminController.deleteSkill);

module.exports = router;
