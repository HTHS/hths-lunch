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
  var howMany = req.body.howMany || 5;

  Item
    .find()
    .sort('-numberOrdered')
    .sort('title')
    .limit(howMany)
    .exec(function(err, items) {
      if (err) {
        return res.status(500).send({
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
  var howMany = req.body.howMany || 10;

  Day
    .find()
    .sort('-date')
    .limit(howMany)
    .exec(function(err, days) {
      if (err) {
        return res.status(500).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(days.reverse());
      }
    });
};
