/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Item = mongoose.model('Item'),
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
