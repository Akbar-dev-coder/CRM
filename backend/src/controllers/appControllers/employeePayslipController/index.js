const Payslip = require('@/models/appModels/Payslip');

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, month } = req.query;

    const filter = { employeeId: req.user._id };
    // by default show only paid payslips to employees

    if (status) {
      filter.status = status;
    } else {
      filter.status = 'Paid';
    }
    if (month) {
      filter.month = month;
    }

    const totalCount = await Payslip.countDocuments(filter);
    const payslips = await Payslip.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      result: payslips,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      message: 'All payslips retrieved successfully',
    });
  } catch (error) {
    console.log('Error in listing paylslips:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

exports.read = async (req, res) => {
  try {
    const { id } = req.params;
    const payslip = await Payslip.findOne({ _id: id, employeeId: req.user._id });
    if (!payslip) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Payslip not found',
      });
    }
    return res.status(200).json({
      success: true,
      result: payslip,
      message: 'Payslip retrieved successfully',
    });
  } catch (error) {
    console.log('Error in reading payslip:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};


