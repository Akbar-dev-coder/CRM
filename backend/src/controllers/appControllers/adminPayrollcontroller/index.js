const Payslip = require('@/models/appModels/Payslip');
const Employee = require('@/models/appModels/Employee');

exports.create = async (req, res) => {
  try {
    const {
      employeeId,
      month,
      otherAllowance,
      specialAllowances,
      tds,
      profTax,
      effectiveWorkDays,
      daysInMonth,
      lop,
      location,
      pfUan,
      pfNo,
      status,
    } = req.body;

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Employee not found',
      });
    }

    // Check if payslip already exists for this employee and month
    const existingPayslip = await Payslip.findOne({
      employeeId: employeeId,
      month,
    });
    if (existingPayslip) {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'Payslip for this employee and month already exists',
      });
    }

    // Create payslip with employee details
    const payslip = await Payslip.create({
      employeeId,
      employeeName: employee.fullName,
      employeeEmail: employee.email,
      employeeCode: employee.employeeId,
      month,
      // batch,
      basicSalary: employee.basicSalary,
      specialAllowances: specialAllowances || 0,
      // deductions: deductions || 0,
      // bonuses: bonuses || 0,
      otherAllowance: otherAllowance || 0,
      profTax: profTax || 0,
      tds: tds || 0,
      effectiveWorkDays: effectiveWorkDays || 0,
      daysInMonth: daysInMonth || 0,
      lop: lop || 0,
      location: location || '',
      pfUan: pfUan || '',
      pfNo: pfNo || '',
      status: status || 'Unpaid',
      generatedBy: req.user?.fullName || req.user?.email || 'admin',
    });

    return res.status(201).json({
      success: true,
      result: payslip,
      message: 'Payslip created successfully',
    });
  } catch (error) {
    console.log('Error in creating payslip:', error);
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

    const { status, month, q, fields } = req.query;
    let query = {};
    if (status) {
      query.status = status;
    }
    if (month) {
      query.month = month;
    }

    if (q) {
      let fieldArray = [];
      if (Array.isArray(fields)) {
        fieldArray = fields;
      } else if (typeof fields === 'string') {
        fieldArray = fields.split(',');
      } else {
        fieldArray = ['employeeName, employeeCode'];
      }
      query.$or = fieldArray.map((field) => ({
        [field]: { $regex: new RegExp(q, 'i') },
      }));
    }

    const totalCount = await Payslip.countDocuments(query);
    const payslips = await Payslip.find(query)
      .populate('employeeId', 'fullName employeeId basicSalary email phone department designation')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
    console.log('Error in listing payslips:', error);
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
    const {
      status,
      specialAllowances,
      otherAllowance,
      tds,
      profTax,
      effectiveWorkDays,
      daysInMonth,
      lop,
      pfUan,
      pfNo,
    } = req.body;

    // Validate status if provided
    if (status && !['Paid', 'Unpaid'].includes(status)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid status. Must be "Paid" or "Unpaid"',
      });
    }

    // Build update object
    const payslip = await Payslip.findById(id);
    if (!payslip) {
      return res.status(404).json({ success: false, result: null, message: 'Payslip not found' });
    }

    //apply updated

    if (status) payslip.status = status;
    if (specialAllowances !== undefined) payslip.specialAllowances = specialAllowances;
    if (otherAllowance !== undefined) payslip.otherAllowance = otherAllowance;
    if (tds !== undefined) payslip.tds = tds;
    if (profTax !== undefined) payslip.profTax = profTax;
    if (effectiveWorkDays !== undefined) payslip.effectiveWorkDays = effectiveWorkDays;
    if (daysInMonth !== undefined) payslip.daysInMonth = daysInMonth;
    if (lop !== undefined) payslip.lop = lop;
    if (pfUan !== undefined) payslip.pfUan = pfUan;
    if (pfNo !== undefined) payslip.pfNo = pfNo;

    // Recalculate gross and net salary
    // payslip.grossSalary = payslip.basicSalary + payslip.specialAllowances + payslip.hra + payslip.otherAllowance;
    // payslip.netSalary = payslip.grossSalary - payslip.tds - payslip.profTax;

    await payslip.save();
    const updatedPayslip = await Payslip.findById(id).populate(
      'employeeId',
      'fullName employeeId email'
    );

    return res.status(200).json({
      success: true,
      result: updatedPayslip,
      message: 'Payslip updated successfully',
    });
  } catch (error) {
    console.log('Error in updating payslip:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const payslip = await Payslip.findByIdAndDelete(id);

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
      message: 'Payslip deleted successfully',
    });
  } catch (error) {
    console.log('Error in deleting payslip:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

// Get single payslip by ID
exports.read = async (req, res) => {
  try {
    const { id } = req.params;

    const payslip = await Payslip.findById(id).populate(
      'employeeId',
      'fullName employeeId email phone department designation basicSalary'
    );

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
    console.log('Error in getting payslip:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

// Mark as Paid + generate PDF
// exports.markAsPaid = async (req, res) => {
//   try {
//     let payslip = await Payslip.findById(req.params.id).populate('employeeId');
//     if (!payslip) return res.status(404).json({ success: false, message: 'Payslip not found' });

//     payslip.status = 'Paid';
//     payslip.payDate = new Date();

//     const pdf = await generatePayslipPDF({ employee: payslip.employeeId, payslip });
//     payslip.pdfUrl = pdf.publicUrl;

//     await payslip.save();

//     return res.json({
//       success: true,
//       result: payslip,
//       message: 'Payslip marked as paid & PDF generated',
//     });
//   } catch (error) {
//     console.error('Error marking payslip paid:', error);
//     return res.status(500).json({ success: false, message: 'Internal server error' });
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

    let results = await Payslip.find({
      ...fields,
    })
      .limit(20)
      .exec();

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
