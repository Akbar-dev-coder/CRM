const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const summary = require('./summary');

function venderController() {
  const Model = mongoose.model('Vender');
  const methods = createCRUDController('Vender');

  methods.summary = (req, res) => summary(Model, req, res);
  return methods;
}

module.exports = venderController();
