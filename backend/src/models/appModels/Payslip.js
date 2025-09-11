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

    //salary components
    basicSalary: { type: Number },
    specialAllowances: { type: Number, default: 0 },
    otherAllowance: { type: Number, default: 0 },

    //deductions components
    deductions: { type: Number, default: 0 }, //total deductions
    profTax: {
      type: Number,
      default: 0,
    },
    tds: {
      type: Number,
      default: 0,
    },

    //calculated fields
    grossSalary: { type: Number }, // auto-calculated
    netSalary: { type: Number }, // auto-calculated

    //additional fields
    effectiveWorkDays: {
      type: Number,
      default: 30,
    },
    daysInMonth: {
      type: Number,
      default: 0,
    },
    lop: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: '',
    },
    pfUan: {
      type: String,
    },
    pfNo: {
      type: String,
    },

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
  //calculate HRA as 50% of basic salary
  const hra = Math.round(this.basicSalary * 0.5);

  //calculate gross salary
  this.grossSalary = this.basicSalary + hra + this.specialAllowances + this.otherAllowance;

  // Calculate total deductions if not provided
  if (!this.deductions) {
    this.deductions = this.profTax + this.tds;
  }

  //calculate net salary
  this.netSalary = this.grossSalary - this.deductions;

  if (this.status === 'Paid' && !this.payDate) {
    this.payDate = new Date();
  }
  next();
});

// Virtual to get HRA (can be customized based on company policy)
payslipSchema.virtual('hra').get(function () {
  return Math.round(this.basicSalary * 0.5);
});

//virtual to get breakdown of earning
payslipSchema.virtual('earnings').get(function () {
  return {
    basic: this.basicSalary,
    hra: this.hra,
    specialAllowances: this.specialAllowances,
    otherAllowance: this.otherAllowance,
  };
});

//virtual to get brackdown of deductions
payslipSchema.virtual('deductionDetails').get(function () {
  return {
    profTax: this.profTax,
    tds: this.tds,
  };
});

module.exports = mongoose.model('Payslip', payslipSchema);
