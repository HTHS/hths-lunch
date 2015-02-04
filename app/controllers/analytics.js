/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Item = mongoose.model('Item'),
  Day = mongoose.model('Day'),
  errorHandler = require('./error');

/**
 * Order items by number of ordered
 */
exports.topItems = function(req, res) {
  Item
    .find()
    .sort('-numberOrdered')
    .sort('title')
    .exec(function(err, items) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(items);
      }
    });
};

/**
 * Get last 10 days
 */
exports.getDays = function(req, res) {
  Day
    .find()
    .sort('-date')
    .limit(10)
    .exec(function(err, days) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(days);
      }
    });
};
