const mongoose = require('mongoose');
const Counter = require('@/models/appModels/Counter');
const venderSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  srNo: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
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
    required: true,
    trim: true,
  },
  panNumber: {
    type: String,
    required: true,
    trim: true,
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true,
  },
  swiftCode: {
    type: String,
    trim: true,
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true,
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  branchName: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
  },
  updatedAt: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

venderSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  const counter = await Counter.findOneAndUpdate(
    {
      entity: 'Vender',
    },
    {
      $inc: { seq: 1 },
    },
    { new: true, upsert: true }
  );
  this.srNo = counter.seq;
  next();
});

venderSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Vender', venderSchema);
