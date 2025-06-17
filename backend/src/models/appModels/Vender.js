const mongoose = require('mongoose');

const venderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  gstNumber: {
    type: String,
    trim: true,
  },
  panNumber: {
    type: String,
    trim: true,
  },
  bankingDetails: {
    accountNumber: {
      type: String,
      trim: true,
    },
    ifscCode: {
      type: String,
      trim: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    branchName: {
      type: String,
      trim: true,
    },
  },
  address: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Vender = mongoose.model('Vender', venderSchema);

module.exports = Vender;
