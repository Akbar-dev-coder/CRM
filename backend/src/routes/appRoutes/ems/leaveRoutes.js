const express = require('express');
const router = express.Router();
const leaveController = require('@/controllers/appControllers/leaveController');
const employeeAuthMiddleware = require('@/controllers/coreControllers/ems/employeeAuthMiddleware');

router.post(
  '/create',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeeAuthMiddleware.requireEmployeeRole,
  leaveController.create
);

router.get(
  '/list',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeeAuthMiddleware.requireEmployeeRole,
  leaveController.list
);

router.get(
  '/read/:id',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeeAuthMiddleware.requireEmployeeRole,
  leaveController.read
);

router.patch(
  '/update/:id',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeeAuthMiddleware.requireEmployeeRole,
  leaveController.update
);

router.delete(
  '/delete/:id',
  employeeAuthMiddleware.isValidEmployeeToken,
  employeeAuthMiddleware.requireEmployeeRole,
  leaveController.delete
);

module.exports = router;
