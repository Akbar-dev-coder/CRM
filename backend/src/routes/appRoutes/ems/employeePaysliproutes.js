const express = require('express');
const router = express.Router();

const employeePayslipController = require('@/controllers/appControllers/employeePayslipController');
const employeeAuthMiddleware = require('@/controllers/coreControllers/ems/employeeAuthMiddleware');
// const downloadPDF = require('@/handlers/downloadHandler/downloadPdf');
router.get('/list', employeeAuthMiddleware.isValidEmployeeToken, employeePayslipController.list);
router.get(
  '/read/:id',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeePayslipController.read
);
// router.get('/download/:id', employeeAuthMiddleware.isValidEmployeeToken, async (req, res)=>{
//   return downloadPDF(req,res,{directory: 'payslip', id: req.params.id})
// })

module.exports = router;
