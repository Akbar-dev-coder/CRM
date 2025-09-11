const express = require('express');
const router = express.Router();
const adminPayrollController = require('@/controllers/appControllers/adminPayrollcontroller');
const adminAuth = require('@/controllers/coreControllers/adminAuth');

router.post('/create', adminAuth.isValidAuthToken, adminPayrollController.create);
router.get('/list', adminAuth.isValidAuthToken, adminPayrollController.list);
router.get('/read/:id', adminAuth.isValidAuthToken, adminPayrollController.read);
router.delete('/delete/:id', adminAuth.isValidAuthToken, adminPayrollController.delete);
router.patch('/update/:id', adminAuth.isValidAuthToken, adminPayrollController.update);
router.get('/search', adminAuth.isValidAuthToken, adminPayrollController.search);

module.exports = router;
