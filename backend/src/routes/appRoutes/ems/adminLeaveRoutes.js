const express = require('express');
const router = express.Router();
const adminAuth = require('@/controllers/coreControllers/adminAuth');
const adminLeaveController = require('@/controllers/appControllers/adminLeaveController');

router.get('/list', adminAuth.isValidAuthToken, adminLeaveController.list);
router.patch('/update/:id', adminAuth.isValidAuthToken, adminLeaveController.update);
router.delete('/delete/:id', adminAuth.isValidAuthToken, adminLeaveController.delete);

module.exports = router;
