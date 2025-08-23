const express = require('express');
const router = express.Router();
const employeeAuthcontroller = require('@/controllers/coreControllers/ems/employeeAuthController');
const employeeAuthMiddleware = require('@/controllers/coreControllers/ems/employeeAuthMiddleware');
const { catchErrors } = require('@/handlers/errorHandlers');

router.post('/login', catchErrors(employeeAuthcontroller.login));
router.post(
  '/logout',
  employeeAuthMiddleware.isValidEmployeeToken,
  catchErrors(employeeAuthcontroller.logout)
);

module.exports = router;
