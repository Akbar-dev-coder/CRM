const mongoose = require('mongoose');
const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Public Holiday'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

leaveSchema.index({ employeeId: 1, startDate: 1 });
leaveSchema.index({ status: 1 });

module.exports = mongoose.model('Leave', leaveSchema);
