const express = require('express');
const router = express.Router();
const attendancecontroller = require('@/controllers/appControllers/attendanceController');
const employeeAuthMiddleware = require('@/controllers/coreControllers/ems/employeeAuthMiddleware');

router.post(
  '/create',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeeAuthMiddleware.requireEmployeeRole,
  attendancecontroller.create
);

router.get(
  '/list',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeeAuthMiddleware.requireEmployeeRole,
  attendancecontroller.list
);

router.get(
  '/read/:id',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeeAuthMiddleware.requireEmployeeRole,
  attendancecontroller.read
);
router.patch(
  '/update/:id',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeeAuthMiddleware.requireEmployeeRole,
  attendancecontroller.update
);
router.delete(
  '/delete/:id',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeeAuthMiddleware.requireEmployeeRole,
  attendancecontroller.delete
);

module.exports = router;
