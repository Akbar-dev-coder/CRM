const Leave = require('@/models/appModels/Leave');
const Employee = require('@/models/appModels/Employee');

exports.create = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, comment } = req.body;

    // Get employee details from the logged-in user
    const employee = await Employee.findById(req.user._id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // validation
    if (!leaveType || !startDate || !endDate || !comment) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    //validate date
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date',
      });
    }

    if (start < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot apply for leave on past date',
      });
    }

    // check for overlapping leave
    const overlappingLeave = await Leave.findOne({
      employeeId: req.user._id,
      status: { $in: ['Pending', 'Approved'] },
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start },
        },
      ],
    });

    if (overlappingLeave) {
      return res.status(400).json({
        success: false,
        message: 'You already have a leave request for overlapping dates',
      });
    }

    // Create Leave request with auto-filled employee name
    const leave = await Leave.create({
      employeeId: req.user._id,
      employeeName: employee.fullName, // Auto-fill from employee record
      leaveType,
      startDate: start,
      endDate: end,
      comment,
      appliedDate: new Date(),
    });

    return res.status(200).json({
      success: true,
      result: leave,
      message: 'Leave request submitted successfully',
    });
  } catch (error) {
    console.error('Error creating leave request:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = { employeeId: req.user._id };
    if (status) {
      query.status = status;
    }

    const totalCount = await Leave.countDocuments(query);

    const leaves = await Leave.find(query)
      .populate('employeeId', ' fullName employeeId') // Populate employee details
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
      message: 'Leave requests retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

// Get single leave request
exports.read = async (req, res) => {
  try {
    const leave = await Leave.findOne({
      _id: req.params.id,
      employeeId: req.user._id,
    }).populate('employeeId', 'fullName employeeId'); // Populate employee details

    if (!leave) {
      return res.status(400).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    return res.status(200).json({
      success: true,
      result: leave,
      message: 'Leave request retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching leave request:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

// Employee updates their own leave (only if pending)
exports.update = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, comment } = req.body;

    // find the leave request
    const existingLeave = await Leave.findOne({
      _id: req.params.id,
      employeeId: req.user._id,
    });

    if (!existingLeave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    // Only allow updates if status is pending
    if (existingLeave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update leave request that has already been processed',
      });
    }

    //update data
    let updateData = {};

    if (leaveType) updateData.leaveType = leaveType;
    if (comment) updateData.comment = comment;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date',
        });
      }

      if (start < new Date().setHours(0, 0, 0, 0)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot apply for leave on past dates',
        });
      }
      updateData.startDate = start;
      updateData.endDate = end;
    }

    const leave = await Leave.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate(
      'employeeId',
      'fullName employeeId'
    );

    return res.status(200).json({
      success: true,
      result: leave,
      message: 'Leave request updated successfully',
    });
  } catch (error) {
    console.error('Error updating leave request:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

// Employee deletes their own leave (only if pending)
exports.delete = async (req, res) => {
  try {
    const leave = await Leave.findOne({
      _id: req.params.id,
      employeeId: req.user._id,
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    // Only allow deletion if status is pending
    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete leave request that has already been processed',
      });
    }

    await Leave.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Leave request deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting leave request:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};
