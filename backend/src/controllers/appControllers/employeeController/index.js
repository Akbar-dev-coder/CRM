const Employee = require('@/models/appModels/ems/Employee');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const employeeController = createCRUDController('Employee');

module.exports = employeeController;
