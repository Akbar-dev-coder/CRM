const Employee = require('@/models/appModels/Employee');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

function employeeController() {
  const methods = createCRUDController('Employee');

  return methods;
}

module.exports = employeeController();
