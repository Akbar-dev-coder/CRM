const Attendance = require('@/models/appModels/Attendance');
const moment = require('moment');
exports.create = async (req, res) => {
  try {
    const { name, attendanceDate, shift, workType, checkInDate, checkOutDate, checkIn, checkOut } =
      req.body;

    if (!attendanceDate) {
      return res.status(400).json({
        success: false,
        message: 'Attendance date is required',
      });
    }

    const formattedCheckIn =
      checkIn && moment(checkIn, ['HH:mm', moment.ISO_8601]).isValid()
        ? moment(checkIn, ['HH:mm', moment.ISO_8601]).format('HH:mm')
        : null;

    const formattedCheckOut =
      checkOut && moment(checkOut, ['HH:mm', moment.ISO_8601]).isValid()
        ? moment(checkOut, ['HH:mm', moment.ISO_8601]).format('HH:mm')
        : null;

    const startOfDay = new Date(attendanceDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      employeeId: req.user._id,
      attendanceDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Attendance for this date already exists.',
      });
    }

    // Create attendance
    const attendance = await Attendance.create({
      employeeId: req.user._id,
      name,
      attendanceDate,
      shift,
      workType,
      checkInDate,
      checkOutDate,
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
    });

    return res.status(201).json({
      success: true,
      result: {
        name: attendance.name,
        attendanceDate: attendance.attendanceDate,
        shift: attendance.shift,
        workType: attendance.workType,
        checkInDate: attendance.checkInDate,
        checkOutDate: attendance.checkOutDate,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
      },
      message: 'Attendance created successfully',
    });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Attendance.countDocuments({ employeeId: req.user._id });

    const attendances = await Attendance.find({
      employeeId: req.user._id,
    })
      .sort({ attendancedate: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      result: attendances,
      pagination: {
        page,
        count: totalCount,
      },
      message: 'Attendance records retrieved successfully',
    });
  } catch (error) {
    console.log('Error fetching attendance records:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// exports.listAll = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.items) || 10;
//     const skip = (page - 1) * limit;

//     const totalCount = await Attendance.countDocuments({});

//     const attendances = await Attendance.find({

//     })
//       .sort({ attendancedate: -1 })
//       .skip(skip)
//       .limit(limit);

//     return res.status(200).json({
//       success: true,
//       result: attendances,
//       pagination: {
//         page,
//         count: totalCount,
//       },
//       message: 'All Attendance records retrieved successfully',
//     });
//   } catch (error) {
//     console.log('Error fetching attendance records:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };

exports.read = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      _id: req.params.id,
      employeeId: req.user._id,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found',
      });
    }
    return res.status(200).json({
      success: true,
      result: attendance,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error fetching attendance record',
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, shift, workType, checkIn, checkOut } = req.body;
    let formattedCheckIn = checkIn;
    let formattedCheckOut = checkOut;

    //only format if the input is valid

    if (checkIn) {
      const checkInMoment = moment(checkIn, ['HH:mm', moment.ISO_8601]);

      if (checkInMoment.isValid()) {
        formattedCheckIn = checkInMoment.format('HH:mm');
      }
    }

    if (checkOut) {
      const checkOutMoment = moment(checkOut, ['HH:mm', moment.ISO_8601]);

      if (checkOutMoment.isValid()) {
        formattedCheckOut = checkOutMoment.format('HH:mm');
      }
    }

    console.log('CheckOut valid:', moment(checkOut, ['HH:mm', moment.ISO_8601]).isValid());
    console.log('CheckIn valid:', moment(checkIn, ['HH:mm', moment.ISO_8601]).isValid());
    const attendance = await Attendance.findOneAndUpdate(
      {
        _id: req.params.id,
        employeeId: req.user._id,
      },
      {
        name,
        shift,
        workType,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
      },
      {
        new: true,
      }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found',
      });
    }

    return res.status(200).json({
      success: true,
      result: attendance,
      message: 'Attendance update successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'error updating attendance record',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndDelete({
      _id: req.params.id,
      employeeId: req.user._id,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Attendance deleted successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error deleting attendance record',
    });
  }
};
