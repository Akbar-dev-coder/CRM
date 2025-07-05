const Joi = require('joi');

const schema = Joi.object({
  client: Joi.alternatives().try(Joi.string(), Joi.object()).required(),
  number: Joi.number().required(),
  year: Joi.number().required(),
  status: Joi.string().required(),
  notes: Joi.string().allow(''),
  expiredDate: Joi.date().required(),
  date: Joi.date().required(),
  purchaseOrderNumber: Joi.string().allow(''),
  purchaseOrderDate: Joi.date().required(),

  items: Joi.array().items(
    Joi.object({
      _id: Joi.string().allow('').optional(),
      // itemName: Joi.string().required(),
      description: Joi.string().allow(''),
      hsnSacCode: Joi.string().allow(''),
      quantity: Joi.number().required(),
      price: Joi.number().required(),
      total: Joi.number().required(),
    }).required()
  ),

  cgstRate: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  sgstRate: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  igstRate: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),

  cgstAmount: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  sgstAmount: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  igstAmount: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  taxTotal: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
  total: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),

  // Optional: add discount if it's part of the submission
  // discount: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
});

module.exports = schema;
