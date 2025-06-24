const mongoose = require('mongoose');
const moment = require('moment');

const summary = async (Model, req, res) => {
  let defaultType = 'month';
  const { type } = req.query;

  if (type && ['week', 'month', 'year'].includes(type)) {
    defaultType = type;
  } else if (type) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid type',
    });
  }

  const currentDate = moment();
  const startDate = currentDate.clone().startOf(defaultType);
  const endDate = currentDate.clone().endOf(defaultType);

  const pipeline = [
    {
      $facet: {
        totalVenders: [
          {
            $match: {
              removed: false,
              enabled: true,
            },
          },
          {
            $count: 'count',
          },
        ],
        newVenders: [
          {
            $match: {
              removed: false,
              enabled: true,
              created: { $gte: startDate.toDate(), $lte: endDate.toDate() },
            },
          },
          { $count: 'count' },
        ],
      },
    },
  ];

  const aggregationResult = await Model.aggregate(pipeline);

  const result = aggregationResult[0];
  const total = result.totalVenders[0]?.count || 0;
  const newVenders = result.newVenders[0]?.count || 0;
  const newPercentage = total > 0 ? (newVenders / total) * 100 : 0;

  return res.status(200).json({
    success: true,
    result: {
      new: Math.round(newPercentage),
    },
    message: 'Vender summary generated successfully',
  });
};

module.exports = summary;
