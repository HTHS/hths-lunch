/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Day Schema
 */
var DaySchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  orders: [{
    type: Schema.ObjectId,
    ref: 'Order',
    default: []
  }],
});

mongoose.model('Day', DaySchema);
