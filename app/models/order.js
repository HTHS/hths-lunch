/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
  customer: {
    type: String,
    required: true
  },
  user: { // change to customer once belongs to relationship can be established
    type: Schema.ObjectId,
    required: true
  },
  items: [{
    type: Schema.ObjectId,
    ref: 'Item',
    required: true
  }],
  quantity: [{
    type: Number,
    required: true
  }],
  total: {
    type: Number,
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
}, {
  toObject: {
    virtuals: true
  }
});

OrderSchema.virtual('toUpdate').get(function() {
  return this._toUpdate;
}).set(function(toUpdate) {
  return this._toUpdate = toUpdate;
});

OrderSchema.pre('save', function(next) {
  this.updated = new Date();
  return next();
});

mongoose.model('Order', OrderSchema);
