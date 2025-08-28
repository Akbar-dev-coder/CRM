const Payslip = require('@/models/appModels/Payslip');
const Employee = require('@/models/appModels/Employee');

exports.create = async (req, res) => {
  try {
    const { employeeId, month, batch, allowances, deductions, bonuses, status } = req.body;

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
      batch,
      basicSalary: employee.basicSalary,
      allowances: allowances || 0,
      deductions: deductions || 0,
      bonuses: bonuses || 0,
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

    const { status, month } = req.query;
    let query = {};
    if (status) {
      query.status = status;
    }
    if (month) {
      query.month = month;
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
    const { status, allowances, deductions, bonuses } = req.body;

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
    if (allowances !== undefined) payslip.allowances = allowances;
    if (deductions !== undefined) payslip.deductions = deductions;
    if (bonuses !== undefined) payslip.bonuses = bonuses;

    // Recalculate gross and net salary
    payslip.grossSalary = payslip.basicSalary + payslip.allowances + payslip.bonuses;
    payslip.netSalary = payslip.grossSalary - payslip.deductions;

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
