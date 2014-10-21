/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
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
			res.jsonp(order);
		}
	});
};

/**
 * Show the current Item
 */
exports.read = function(req, res) {
	res.jsonp(req.order);
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
			res.jsonp(order);
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
			res.jsonp(order);
		}
	});
};

/**
 * List of Orders
 */
exports.list = function(req, res) {
	Order.find().populate('items').exec(function(err, orders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(orders);
		}
	});
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) {
	Order.findById(id).populate('items').exec(function(err, order) {
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
