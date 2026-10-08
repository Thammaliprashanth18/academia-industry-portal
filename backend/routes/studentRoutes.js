const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All student routes require student role
router.use(authenticate, authorize('student'));

router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.post('/resume', upload.single('resume'), studentController.uploadResume);
router.post('/avatar', upload.single('avatar'), studentController.uploadAvatar);

router.get('/dashboard', studentController.getDashboard);
router.get('/skills', studentController.getSkills);
router.post('/skills', studentController.addSkill);
router.delete('/skills/:skillId', studentController.removeSkill);
router.get('/skill-gap', studentController.getSkillGap);

router.post('/education', studentController.addEducation);
router.delete('/education/:id', studentController.deleteEducation);

router.post('/projects', studentController.addProject);
router.delete('/projects/:id', studentController.deleteProject);

router.post('/certifications', studentController.addCertification);
router.delete('/certifications/:id', studentController.deleteCertification);

module.exports = router;
