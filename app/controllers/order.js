/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Order = mongoose.model('Order'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
function getErrorMessage(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Order already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) {
				message = err.errors[errName].message;
			}
		}
	}

	return message;
}

/**
 * Create a Item
 */
exports.create = function(req, res) {
	var order = new Order(req.body);

	order.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
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
			return res.send(400, {
				message: getErrorMessage(err)
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
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * List of Items
 */
exports.list = function(req, res) {
	Order.find().exec(function(err, orders) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(orders);
		}
	});
};

/**
 * Item middleware
 */
exports.orderByID = function(req, res, next, id) {
	Order.findById(id).exec(function(err, order) {
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