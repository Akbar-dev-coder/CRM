const express = require('express');
const router = express.Router();
const adminAuth = require('@/controllers/coreControllers/adminAuth');
const adminAttendanceController = require('@/controllers/appControllers/adminAttendanceController');

// router.post('/create', adminAuth.isValidAuthToken, adminAttendanceController.create);
router.get('/list', adminAuth.isValidAuthToken, adminAttendanceController.list);
router.delete('/delete/:id', adminAuth.isValidAuthToken, adminAttendanceController.delete);
router.get('/search', adminAuth.isValidAuthToken, adminAttendanceController.search);
// router.get('/read/:id', adminAuth.isValidAuthToken, adminAttendanceController.read);
// router.patch('/update/:id', adminAuth.isValidAuthToken, adminAttendanceController.update);

module.exports = router;
