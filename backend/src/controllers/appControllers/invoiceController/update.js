const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');

const custom = require('@/controllers/pdfController');
const axios = require('axios');
const { calculate } = require('@/helpers');
const schema = require('./schemaValidate');

const update = async (req, res) => {
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

  const previousInvoice = await Model.findOne({
    _id: req.params.id,
    removed: false,
  });

  const { credit } = previousInvoice;

  // const { items = [], taxRate = 0, discount = 0 } = req.body;
  const {
    items = [],
    cgstRate = 0,
    sgstRate = 0,
    igstRate = 0,
    discount = 0,
    currency = previousInvoice.currency,
  } = value;

  if (items.length === 0) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Items cannot be empty',
    });
  }

  // default
  let subTotal = 0;
  items.forEach((item) => {
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

  let usdToINRValue = total;

  if (currency === 'USD') {
    try {
      const res = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API}/latest/USD`
      );
      const conversionRate = res.data.conversion_rates.INR;
      usdToINRValue = calculate.multiply(total, conversionRate);
    } catch (error) {
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Failed to fetch USD to INR conversion rate',
      });
    }
  }

  // body['subTotal'] = subTotal;
  // body['taxTotal'] = taxTotal;
  // body['total'] = total;
  // body['items'] = items;
  // body['pdf'] = 'invoice-' + req.params.id + '.pdf';
  // if (body.hasOwnProperty('currency')) {
  //   delete body.currency;
  // }
  body = {
    ...body,
    currency,
    subTotal,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    taxTotal,
    total,
    usdToINRValue,
    items,
    pdf: `invoice-${req.params.id}.pdf`,
  };
  // Find document by id and updates with the required fields

  let paymentStatus =
    calculate.sub(total, discount) === credit ? 'paid' : credit > 0 ? 'partially' : 'unpaid';
  body['paymentStatus'] = paymentStatus;

  const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, body, {
    new: true, // return the new result instead of the old one
  }).exec();

  // Returning successfull response

  return res.status(200).json({
    success: true,
    result,
    message: 'we update this document ',
  });
};

module.exports = update;
