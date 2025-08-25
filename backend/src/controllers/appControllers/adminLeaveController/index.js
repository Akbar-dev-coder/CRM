const Leave = require('@/models/appModels/Leave');

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status) {
      query.status = status;
    }

    const totalCount = await Leave.countDocuments(query);
    const leaves = await Leave.find(query)
      .populate('employeeId', 'fullName employeeId')
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      result: leaves,
      pagination: {
        page,
        limit,
        total: totalCount,
      },
      message: 'All leave requests retrived successfully',
    });
  } catch (error) {
    console.log('Error in listing all employee leave', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: "Invalid status. Must be 'Approved' or 'Rejected'",
      });
    }

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Leave request not found',
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(401).json({
        success: false,
        result: null,
        message: `Leave request has already been ${leave.status.toLowerCase()}`,
      });
    }

    leave.status = status;

    if (adminComment) {
      leave.adminComment = adminComment;
    }

    await leave.save();

    return res.status(200).json({
      success: false,
      result: leave,
      message: `Leave request has been successfully ${status.toLowerCase()}`,
    });
  } catch (error) {
    console.log('Error updating leave status', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};
