const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
    name: {
      type: String,
      required: true,
    },
    attendanceDate: {
      type: Date,
    },
    shift: {
      type: String,
      enum: ['Night Shift', 'Morning Shift', 'General Shift'],
      required: true,
    },
    workType: {
      type: String,
      enum: ['Work From Home', 'Work From Office', 'Remote'],
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: String,
      required: true,
    },
    checkOut: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, attendanceDate: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', attendanceSchema);
