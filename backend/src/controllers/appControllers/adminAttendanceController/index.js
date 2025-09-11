const Attendance = require('@/models/appModels/Attendance');
const Employee = require('@/models/appModels/Employee');
const moment = require('moment');

// exports.create = async (req, res) => {
//   try {
//     const {
//       employeeId,
//       name,
//       attendanceDate,
//       shift,
//       workType,
//       checkIn,
//       checkOut,
//       checkInDate,
//       checkOutDate,
//     } = req.body;

//     // validation

//     if (
//       !employeeId ||
//       !name ||
//       !attendanceDate ||
//       !shift ||
//       !workType ||
//       !checkIn ||
//       !checkOut ||
//       !checkInDate ||
//       !checkOutDate
//     ) {
//       return res.status(400).json({
//         success: false,
//         result: null,
//         message: 'All Fields are required',
//       });
//     }

//     //check if employee exists

//     const employee = await Employee.findById(employeeId);

//     if (!employee) {
//       return res.status(402).json({
//         success: false,
//         result: null,
//         message: 'Employee not found',
//       });
//     }

//     //format check in and check out times

//     const formattedCheckIn =
//       checkIn && moment(checkIn, ['HH:mm', moment.ISO_8601]).isValid()
//         ? moment(checkIn, ['HH:mm', moment.ISO_8601]).format('HH:mm')
//         : null;

//     const formattedCheckOut =
//       checkOut && moment(checkOut, ['HH:mm', moment.ISO_8601]).isValid()
//         ? moment(checkOut, ['HH:mm', moment.ISO_8601]).format('HH:mm')
//         : null;

//     //check for existing attendance on the same date

//     const startofDay = new Date(attendanceDate);
//     startofDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(attendanceDate);
//     endOfDay.setHours(0, 0, 0, 0);

//     const existingAttendance = await Attendance.findOne({
//       employeeId: employeeId,
//       attendanceDate: { $gte: startofDay, $lte: endOfDay },
//     });

//     if (existingAttendance) {
//       return res.status(404).json({
//         success: false,
//         result: null,
//         message: 'Attendance for the employee on this date already exists',
//       });
//     }

//     const attendance = await Attendance.create({
//       employeeId,
//       name,
//       shift,
//       workType,
//       checkInDate,
//       checkOutDate,
//       checkIn: formattedCheckIn,
//       checkOut: formattedCheckOut,
//     });

//     //populate employee details in response

//     const populateAttendance = await Attendance.findById(attendance._id);

//     return res.status(200).json({
//       success: true,
//       result: {
//         _id: populateAttendance._id,
//         employeeId: populateAttendance.employeeId,
//         name: populateAttendance.name,
//         attendanceDate: populateAttendance.attendanceDate,
//         shift: populateAttendance.shift,
//         workType: populateAttendance.workType,
//         checkInDate: populateAttendance.checkInDate,
//         checkOutDate: populateAttendance.checkOutDate,
//         checkIn: populateAttendance.checkIn,
//         checkOut: populateAttendance.checkOut,
//       },
//       meaage: `Attendance created successfully for ${employee.name}`,
//     });
//   } catch (error) {
//     console.log('Error in creating attendace:', error);
//     return res.status(500).json({
//       success: false,
//       result: null,
//       message: 'Internal server error',
//     });
//   }
// };

// Get all attendance records with employee details (Admin only)

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;

    const { employeeId, startDate, endDate, shift, workType, q, fields } = req.query;

    let filter = {};

    // Filter by specific employee
    if (employeeId) {
      filter.employeeId = employeeId;
    }

    // Date range filter
    if (startDate && endDate) {
      filter.attendanceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.attendanceDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.attendanceDate = { $lte: new Date(endDate) };
    }

    // Additional filters
    if (shift) filter.shift = shift;
    if (workType) filter.workType = workType;

    // Search filter
    if (q) {
      let fieldArray = [];
      if (Array.isArray(fields)) {
        fieldArray = fields;
      } else if (typeof fields === 'string') {
        fieldArray = fields.split(',');
      } else {
        fieldArray = ['name']; // fallback
      }

      filter.$or = fieldArray.map((field) => ({
        [field]: { $regex: new RegExp(q, 'i') },
      }));
    }

    const totalCount = await Attendance.countDocuments(filter);

    const attendances = await Attendance.find(filter)
      .populate('employeeId', 'fullName employeeId')
      .sort({ attendanceDate: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      result: attendances,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
      message: 'All attendance records retrieved successfully',
    });
  } catch (error) {
    console.log('Error fetching all attendance records:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Admin can delete any employee's attendance
exports.delete = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    return res.status(200).json({
      success: true,
      result: attendance,
      message: 'Attendance record deleted successfully',
    });
  } catch (error) {
    console.log('Error deleting attendance record:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

//add read method for getting signle attendance

exports.read = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate(
      'employeeId',
      'fullName employeeId'
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    return res.status(200).json({
      success: true,
      result: attendance,
      message: 'Attendance record retrieved successfully',
    });
  } catch (error) {
    console.log('Error fetching attendance record:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// exports.update = async (req, res) => {
//   try {
//     const { name, shift, workType, checkIn, checkOut } = req.body;
//     let formattedCheckIn = checkIn;
//     let formattedCheckOut = checkOut;

//     if (checkIn) {
//       const checkInMoment = moment(checkIn, ['HH:mm', moment.ISO_8601]);

//       if (checkInMoment.isValid()) {
//         formattedCheckIn = checkInMoment.format('HH:mm');
//       }
//     }

//     if (checkOut) {
//       const checkOutMoment = moment(checkOut, ['HH:mm', moment.ISO_8601]);

//       if (checkOutMoment.isValid()) {
//         formattedCheckOut = checkOutMoment.format('HH:mm');
//       }
//     }

//     console.log('CheckOut valid:', moment(checkOut, ['HH:mm', moment.ISO_8601]).isValid());
//     console.log('CheckIn valid:', moment(checkIn, ['HH:mm', moment.ISO_8601]).isValid());

//     const attendance = await Attendance.findByIdAndUpdate(
//       req.params.id,
//       {
//         name,
//         shift,
//         workType,
//         checkIn: formattedCheckIn,
//         checkOut: formattedCheckOut,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!attendance) {
//       return res.status(404).json({
//         success: false,
//         message: 'Attendance not found',
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       result: attendance,
//       message: 'Attendance update successfully',
//     });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: 'error updating attendance record',
//     });
//   }
// };

exports.search = async (req, res) => {
  try {
    let fieldArray = [];

    if (Array.isArray(req.query.fields)) {
      fieldArray = req.query.fields;
    } else if (typeof req.query.fields === 'string') {
      fieldArray = req.query.fields.split(',');
    } else {
      fieldArray = ['name'];
    }

    const fields = { $or: [] };

    for (const field of fieldArray) {
      fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
    }

    let results = await Attendance.find({
      ...fields,
    })
      .limit(20)
      .exec();

    console.log('Search results:', results);

    if (results.length >= 1) {
      return res.status(200).json({
        success: true,
        result: results,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(200).json({
        success: true,
        result: [],
        message: 'No document found by this request',
      });
    }
  } catch (error) {
    console.log('Error in search:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};
