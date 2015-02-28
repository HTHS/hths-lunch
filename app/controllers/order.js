/**
 * Module dependencies.
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  Order = mongoose.model('Order'),
  errorHandler = require('./error');

/**
 * Create a Item
 */
exports.create = function(req, res) {
  var order = new Order(req.body);

  order.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(order);
    }
  });
};

/**
 * Show the current Item
 */
exports.read = function(req, res) {
  res.json(req.order);
};

/**
 * Update a Item
 */
exports.update = function(req, res) {
  var order = req.order;

  order = _.extend(order, req.body);

  order.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(order);
    }
  });
};

/**
 * Delete an Item
 */
exports.delete = function(req, res) {
  var order = req.order;

  order.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(order);
    }
  });
};

/**
 * List of Orders
 */
exports.list = function(req, res) {
  Order
    .find()
    .sort('-created')
    .populate('items')
    .exec(function(err, orders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(orders);
      }
    });
};

/**
 * Find orders between 2 dates
 * @param  {Date}       d1 Start date
 * @param  {Date}       d2 End date
 * @return {Promise}    Promise that resolves with orders
 */
exports.between = function findOrdersBetween(d1, d2) {
  var p = Promise.defer();

  Order
		.find({})
		.where('created').gte(d1).lte(d2)
		.sort('created')
		.populate('items')
		.exec(function(err, orders) {
			if (err) {
				p.reject(err);
			} else {
				p.resolve(orders);
			}
		});

	return p.promise;
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) {
  Order
    .findById(id)
    .populate('items')
    .exec(function(err, order) {
      if (err) {
        return next(err);
      }
      if (!order) {
        return next(new Error('Failed to load Order ' + id));
      }
      req.order = order;
      next();
    });
};
