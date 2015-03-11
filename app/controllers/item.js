/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	Promise = require('bluebird'),
	Item = mongoose.model('Item'),
	errorHandler = require('./error');

/**
 * Create a Item
 */
exports.create = function(req, res) {
	var item = new Item(req.body);

	item.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(item);
		}
	});
};

/**
 * Show the current Item
 */
exports.read = function(req, res) {
	res.json(req.item);
};

/**
 * Update a Item
 */
exports.update = function(req, res) {
	var item = req.item;

	item = _.extend(item, req.body);

	item.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(item);
		}
	});
};

/**
 * Delete an Item
 */
exports.delete = function(req, res) {
	var item = req.item;

	item.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(item);
		}
	});
};

/**
 * List of Items
 */
exports.list = function(req, res) {
	Item
	.find()
	.sort('-active')
	.sort('title')
	.exec(function(err, items) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			if (req.itemPriorities) {
				var sortedItems = [];

				for (var i = 0; i < req.itemPriorities.length; i++) {
					var item = items.filter(function(item) {
						return item ? item._id == req.itemPriorities[i] : null;
					});

					sortedItems.push(item[0]); // filter returns an array, there should only be 1 match
				}

				var lodash = _.runInContext(this);
				lodash.mixin({
					'indexOf': lodash.wrap(lodash.indexOf, function(fn, array, value, fromIndex) {
						// use original `lodash.indexOf` if the value is a primitive
						if (!lodash.isObject(value)) {
							return fn(array, value, fromIndex);
						}
						return lodash.findIndex(fromIndex ? array.slice(fromIndex) : array, function(other) {
							return value._id == other._id;
						});
					})
				});

				items = lodash.union(sortedItems, items);
			}

			res.json(items);
		}
	});
};

exports.sortByUserTendency = function sortItemsByUserTendency(req, res, next) {
	if (req.user) {
    var items = {};

    for (var i = 0; i < req.user.orderHistory.length; i++) {
      var order = req.user.orderHistory[i];
      for (var z = 0; z < order.items.length; z++) {
        if (items[order.items[z]._id]) {
          items[order.items[z]._id] += order.quantity[z];
        } else {
          items[order.items[z]] = order.quantity[z];
				}
      }
    }

    req.itemPriorities = Object.keys(items).sort(function(a, b) {
			return items[b] - items[a];
		});
  }

	next();
};

/**
 * Get Items grouped by category
 * @return {Promise}    Promise that resolves with items
 */
exports.byCategory = function getItemsByCategory() {
	var promises = [];
	var categories = [
		'Hot',
		'Sandwiches',
		'Salads',
		'Snacks'
	];

	categories.forEach(function(category) {
		var p = Promise.defer();

		Item
			.find()
			.where('category').equals(category)
			.sort('title')
			.exec(function(err, items) {
				if (err) {
					console.log(err);
					return p.reject(err);
				}

				p.resolve(items);
			});

		promises.push(p.promise);
	});

	return Promise.all(promises);
};

/**
 * Item middleware
 */
exports.itemByID = function(req, res, next, id) {
	Item.findById(id).exec(function(err, item) {
		if (err) {
			return next(err);
		}
		if (!item) {
			return next(new Error('Failed to load Item ' + id));
		}
		req.item = item;
		next();
	});
};
