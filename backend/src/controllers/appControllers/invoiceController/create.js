const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');

const { calculate } = require('@/helpers');
const { increaseBySettingKey } = require('@/middlewares/settings');
const schema = require('./schemaValidate');

const create = async (req, res) => {
  let body = req.body;

  const { error, value } = schema.validate(body);
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    });
  }

  const { items = [], cgstRate = 0, sgstRate = 0, igstRate = 0, discount = 0 } = value;

  // const { items = [], taxRate = 0, discount = 0 } = value;

  // default
  let subTotal = 0;
  items.map((item) => {
    const total = calculate.multiply(item.quantity, item.price);
    subTotal = calculate.add(subTotal, total);
    item.total = total;
  });
  // let taxTotal = 0;
  // let total = 0;

  //Calculate the items array with subTotal, total, taxTotal

  // items.map((item) => {
  //   let total = calculate.multiply(item['quantity'], item['price']);
  //   //sub total
  //   subTotal = calculate.add(subTotal, total);
  //   //item total
  //   item['total'] = total;
  // });
  const cgstAmount = calculate.multiply(subTotal, cgstRate / 100);
  const sgstAmount = calculate.multiply(subTotal, sgstRate / 100);
  const igstAmount = calculate.multiply(subTotal, igstRate / 100);

  const taxTotal = calculate.add(cgstAmount, calculate.add(sgstAmount, igstAmount));
  const total = calculate.add(subTotal, taxTotal);

  // body['subTotal'] = subTotal;
  // body['taxTotal'] = taxTotal;
  // body['total'] = total;
  // body['items'] = items;

  let paymentStatus = calculate.sub(total, discount) === 0 ? 'paid' : 'unpaid';

  // body['paymentStatus'] = paymentStatus;
  // body['createdBy'] = req.admin._id;

  body = {
    ...body,
    subTotal,
    sgstRate,
    sgstAmount,
    cgstRate,
    cgstAmount,
    igstRate,
    igstAmount,
    taxTotal,
    total,
    paymentStatus,
    createdBy: req.admin._id,

    items,
  };

  // Creating a new document in the collection
  const result = await new Model(body).save();

  const fileId = 'invoice-' + result._id + '.pdf';
  const updateResult = await Model.findOneAndUpdate(
    { _id: result._id },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();
  // Returning successfull response

  increaseBySettingKey({
    settingKey: 'last_invoice_number',
  });

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Invoice created successfully',
  });
};

module.exports = create;
