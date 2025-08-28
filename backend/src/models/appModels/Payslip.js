// const mongoose = require('mongoose');

// const payslipSchema = new mongoose.Schema(
//   {
//     employeeId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Employee',
//       required: true,
//     },
//     employeeCode: {
//       type: String,
//     },
//     employeeName: {
//       type: String,
//     },
//     employeeEmail: {
//       type: String,
//     },
//     month: {
//       type: String,
//       required: true,
//     },
//     batch: {
//       type: String,
//     },
//     basicSalary: {
//       type: Number,
//     },
//     grossSalary: {
//       type: Number,
//       required: true,
//     },
//     netSalary: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ['Paid', 'Unpaid'],
//       default: 'Unpaid',
//     },
//   },
//   { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
// );
// // Compound index to prevent duplicate payslips for same employee and month
// payslipSchema.index({ employeeId: 1, month: 1 });
// payslipSchema.index({ status: 1 });
// payslipSchema.index({ createdAt: 1 });

// // Virtual to calculate deductions
// payslipSchema.virtual('deductions').get(function () {
//   return this.grossSalary - this.netSalary;
// });

// // Static method to get payslips by employee
// payslipSchema.statics.getByEmployeeId = function (employeeId, status = null) {
//   const query = { employeeId };
//   if (status) {
//     query.status = status;
//   }
//   return this.find(query).sort({ createdAt: -1 });
// };

// // Static method to get payslips by month
// payslipSchema.statics.getByMonth = function (month, status = null) {
//   const query = { month };
//   if (status) {
//     query.status = status;
//   }
//   return this.find(query)
//     .populate('employeeId', 'fullName employeeId email')
//     .sort({ createdAt: -1 });
// };

// module.exports = mongoose.model('Payslip', payslipSchema);

const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    employeeCode: { type: String },
    employeeName: { type: String },
    employeeEmail: { type: String },

    month: { type: String, required: true },
    batch: { type: String },

    basicSalary: { type: Number },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    bonuses: { type: Number, default: 0 },

    grossSalary: { type: Number }, // auto-calculated
    netSalary: { type: Number }, // auto-calculated

    status: {
      type: String,
      enum: ['Paid', 'Unpaid'],
      default: 'Unpaid',
    },

    payDate: { type: Date }, // auto set when marked as paid
    generatedBy: { type: String }, // admin/HR name or id
    pdfUrl: { type: String }, // link to generated PDF
  },
  { timestamps: true }
);

// prevent duplicate payslips for same employee & month
payslipSchema.index({ employeeId: 1, month: 1 }, { unique: true });

// Auto-calc gross & net before saving
payslipSchema.pre('save', function (next) {
  this.grossSalary = this.basicSalary + this.allowances + this.bonuses;
  this.netSalary = this.grossSalary - this.deductions;

  if (this.status === 'Paid' && !this.payDate) {
    this.payDate = new Date();
  }
  next();
});

module.exports = mongoose.model('Payslip', payslipSchema);
