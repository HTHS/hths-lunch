/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Item Schema
 */
var ItemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  numberOrdered: {
    type: Number,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Item', ItemSchema);
