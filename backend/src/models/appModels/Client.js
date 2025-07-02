const mongoose = require('mongoose');
const Counter = require('@/models/appModels/Counter');
const schema = new mongoose.Schema({
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
  },
  phone: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  gstno: {
    type: String,
    required: true,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  const counter = await Counter.findOneAndUpdate(
    { entity: 'Client' },
    {
      $inc: { seq: 1 },
    },
    { new: true, upsert: true }
  );

  this.srNo = counter.seq;
  next();
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Client', schema);
