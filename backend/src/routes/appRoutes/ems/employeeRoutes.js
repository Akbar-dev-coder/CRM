const express = require('express');
const router = express.Router();
const employeeAuthcontroller = require('@/controllers/coreControllers/ems/employeeAuthController');

router.post('/login', employeeAuthcontroller.login);
router.post('/logout', employeeAuthcontroller.logout);

module.exports = router;
