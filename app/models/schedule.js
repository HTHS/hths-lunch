/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Schedule Schema
 */
var ScheduleSchema = new Schema({
  schedules: {
    type: Array,
    required: true
  },
  exceptions: {
    type: Array,
    default: []
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

ScheduleSchema.pre('save', function(next) {
  this.updated = new Date();

  return next();
});

mongoose.model('Schedule', ScheduleSchema);
