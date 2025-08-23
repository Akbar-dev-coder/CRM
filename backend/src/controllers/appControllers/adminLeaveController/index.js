const Attendance = require('@/models/appModels/Attendance');
const Employee = require('@/models/appModels/Employee');

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;

    const { month, year, startDate, endDate, employeeName, shift, workType, employeeId } =
      req.query;

    let filter = {};

    if (startDate && endDate) {
      filter.attendanceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (month && year) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
      filter.attendanceDate = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    } else if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
      filter.attendanceDate = {
        $gte: startOfYear,
        $lte: endOfYear,
      };
    }

    if (shift) filter.shift = shift;
    if (workType) filter.workType = workType;
    if (employeeId) filter.employeeId = employeeId;

    let pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee',
        },
      },
      { $unwind: '$employee' },
    ];

    if (employeeName) {
      pipeline.push({
        $match: {
          $or: [{ 'employee.name': { $regex: employeeName, $options: 'i' } }],
        },
      });
    }
    pipeline.push({ $sort: { attendanceDate: -1 } });

    const countPipline = [...pipeline, { $count: 'total' }];
    const totalResult = await Attendance.aggregate(countPipline);
    const totalCount = totalResult[0]?.total || 0;

    pipeline.push({ $skip: skip }, { $limit: limit });

    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        attendanceDate: 1,
        shift: 1,
        workType: 1,
        checkIn: 1,
        checkOut: 1,
        checkInDate: 1,
        checkOutDate: 1,
      },
    });

    const attendance = await Attendance.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      result: attendance,
      pagination: {
        page,
        pages: Math.ceil(totalCount / limit),
        count: totalCount,
        limit,
      },
      message: ' Admin attendance record retrived successfully',
    });
  } catch (error) {
    console.log('Error fetching attendence admin record', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
