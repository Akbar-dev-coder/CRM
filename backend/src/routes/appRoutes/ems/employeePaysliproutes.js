const express = require('express');
const router = express.Router();

const employeePayslipController = require('@/controllers/appControllers/employeePayslipController');

const employeeAuthMiddleware = require('@/controllers/coreControllers/ems/employeeAuthMiddleware');

router.get('/list', employeeAuthMiddleware.isValidEmployeeToken, employeePayslipController.list);
router.get(
  '/read/:id',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeePayslipController.read
);

module.exports = router;
