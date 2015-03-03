/**
 * Module dependencies.
 */
var _ = require('lodash'),
	later = require('later'),
	mongoose = require('mongoose'),
	Promise = require('bluebird'),
	Schedule = mongoose.model('Schedule'),
	Order = mongoose.model('Order'),
	Day = mongoose.model('Day'),
	orders = require('./order'),
	items = require('./item'),
	csv = require('./csv'),
	Email = require('./email'),
	errorHandler = require('./error');

// Use ET for calculating start end days of school year
later.date.localTime();

/**
 * Create a Schedule
 */
exports.create = function(req, res) {
	var startDate = new Date(req.body.startDate);
	var endDate = new Date(req.body.endDate);
	var time = req.body.time;
	var exceptions = req.body.exceptions;

	exports.schoolDays = later.parse.recur()
		.on(time).hour()
		.onWeekday()
		.on(1, 2, 3, 4, 5, 6, 9, 10, 11, 12).month();

	exceptions.forEach(function(exception, index) {
		exception = new Date(exception);

		if (index === 0) {
			exports.schoolDays.except()
				.on(exception.getMonth()).month()
				.on(exception.getDate()).dayOfMonth()
				.on(exception.getFullYear()).year();
		} else {
			exports.schoolDays.and()
				.on(exception.getMonth()).month()
				.on(exception.getDate()).dayOfMonth()
				.on(exception.getFullYear()).year();
		}
	});

	exports.schoolDays.startDate = startDate;
	exports.schoolDays.endDate = endDate;

	var schedule = new Schedule(exports.schoolDays);

	schedule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			exports.schoolSchedule = later.schedule(exports.schoolDays)
				.next(500, startDate, endDate);

			exports.job = later.setInterval(exports.endSubmissionsForDay, exports.schoolDays);

			res.json(exports.schoolSchedule);
		}
	});
};

/**
 * Show the current Schedule
 */
exports.read = function(req, res) {
	res.json(exports.schoolSchedule);
};

/**
 * Get the current schedule raw data
 */
exports.getRawSchedule = function(req, res) {
	res.json(exports.schoolDays);
};

/**
 * Update a Schedule
 */
exports.update = function(req, res) {
	exports.schoolDays = _.union(exports.schoolDays, req.body.exceptions);

	if (req.body.time) {
		exports.schoolDays.schedules[0].h[0] = req.body.time;
	}

	Schedule.findOneAndUpdate({}).exec(function(err, schedule) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			exports.schoolSchedule = later.schedule(exports.schoolDays)
				.next(500, exports.schoolDays.startDate, exports.schoolDays.endDate);

			exports.job.clear();
			exports.job = later.setInterval(exports.endSubmissionsForDay, exports.schoolDays);

			res.json(exports.schoolSchedule);
		}
	});
};

exports.init = function scheduleOrderProcessing() {
	var p = Promise.defer();

	Schedule.findOne().exec(function(err, schedule) {
		if (!err && schedule) {
			var startDate = new Date(schedule.startDate);
			var endDate = new Date(schedule.endDate);
			var time = schedule.schedules[0].h[0];
			var exceptions = schedule.exceptions;

			exports.schoolDays = later.parse.recur()
				.on(time).hour()
				.onWeekday()
				.on(1, 2, 3, 4, 5, 6, 9, 10, 11, 12).month();

			exceptions.forEach(function(exception, index) {
				exception = new Date(exception);

				if (index === 0) {
					exports.schoolDays.except()
						.on(exception.getMonth()).month()
						.on(exception.getDate()).dayOfMonth()
						.on(exception.getFullYear()).year();
				} else {
					exports.schoolDays.and()
						.on(exception.getMonth()).month()
						.on(exception.getDate()).dayOfMonth()
						.on(exception.getFullYear()).year();
				}
			});

			exports.schoolDays.startDate = startDate;
			exports.schoolDays.endDate = endDate;
			exports.schoolSchedule = later.schedule(exports.schoolDays).next(
				500,
				exports.schoolDays.startDate, exports.schoolDays.endDate);
			exports.job = later.setInterval(exports.endSubmissionsForDay, exports.schoolDays);
		}

		p.resolve();
	});

	return p.promise;
};

exports.isBetween = function(date) {
	if (!exports.schoolDays) {
		return false;
	}

	var now = new Date();
	var prev1 = later.schedule(exports.schoolDays).prev(1, now);
	var next1 = later.schedule(exports.schoolDays).next(1, now);

	if (next1 - date < next1 - prev1) {
		return true;
	} else {
		return false;
	}
};

exports.getNextDay = function() {
	if (!exports.schoolDays) {
		return false;
	}

	var now = new Date();
	return later.schedule(exports.schoolDays).next(1, now);
};

function createDay(orders) {
	var p = Promise.defer();

	var today;

	if (orders.length) {
		orders.forEach(function(order) {
			order.items.forEach(function(item) {
				item
					.update({
						$inc: {
							numberOrdered: 1
						}
					}, {}, function(err, numberUpdated, result) {
						if (err) {
							console.error('Error: Tried to increment numberOrdered on item: ', item);
							console.error(err);
						}
					});
			});
		});

		var orderIDs = orders.map(function(order) {
			return order._id;
		});

		today = new Day({
			orders: orderIDs
		});
	} else {
		today = new Day({
			orders: []
		});
	}

	today.save(function(err, today) {
		if (err) {
			p.reject(err);
			console.error(err);
		} else {
			p.resolve(today);
		}
	});

	return p.promise;
}

function createCSVInput(today) {
	var orderData = {
		items: {},
		quantity: [],
		total: 0
	};

	var orderCSVData = [
		['', '', 'High Technology High School Orders', '', ''],
		[],
		['', 'Quantity', 'Items', 'Total', '']
	];
	var customerCSVData = [
		['', 'HTHS', ''],
		[],
		['Customer', 'Items', 'Total']
	];

	var orderTallyPromises = [];
	today.orders.forEach(function(orderID) {
		var p = Promise.defer();
		orderTallyPromises.push(p.promise);

		Order
			.findById(orderID)
			.populate('items')
			.populate('user')
			.sort('customer')
			.exec(function(err, order) {
				if (err) {
					// TODO do something
					p.reject(err);
				} else {
					order.items.forEach(function(item, index) {
						if (orderData.items[item._id]) {
							orderData.items[item._id].quantity++;
						} else {
							orderData.items[item._id] = {
								title: item.title,
								quantity: order.quantity[index],
								price: item.price,
								category: item.category
							};
						}
					});

					var user = order.user.displayName;
					var itemsOrdered = order.items.map(function(item, index) {
						return item.title + ' x' + order.quantity[index];
					}).join(', ');
					var total = order.total;
					customerCSVData.push([user, itemsOrdered, '$' + total.toFixed(2)]);

					p.resolve(order);
				}
			});
	});

	return Promise
		.all(orderTallyPromises)
		.then(function() {
			orderData.items = Object.keys(orderData.items).map(function(key) {
				return orderData.items[key];
			});

			return items
				.byCategory()
				.then(function(items) {
					items = _.flatten(items);

					var itemTitles = items.map(function(item) {
						return item.title;
					});

					for (var i = 0; i < orderData.items.length; i++) {
						var item = orderData.items[i];

						var newItem = items[itemTitles.indexOf(item.title)];
						newItem.quantity = item.quantity;
						newItem.total = item.price * item.quantity;
					}

					var hotItems = items.filter(function(item) {
						return item.category === 'Hot' ? item : null;
					});

					var sandwichItems = items.filter(function(item) {
						return item.category === 'Sandwiches' ? item : null;
					});

					var saladItems = items.filter(function(item) {
						return item.category === 'Salads' ? item : null;
					});

					var snackItems = items.filter(function(item) {
						return item.category === 'Snacks' ? item : null;
					});

					orderCSVData.push(['Hot', '', '', '', '']);
					for (var i = 0; i < hotItems.length; i++) {
						var item = hotItems[i];
						var quantity = item.quantity || 0;
						var total = item.total || 0;
						orderCSVData.push(['', quantity, item.title, '$' + total.toFixed(2), '']);
						orderData.total += total;
					}

					orderCSVData.push([]);
					orderCSVData.push(['Sandwiches', '', '', '', '']);
					for (var i = 0; i < sandwichItems.length; i++) {
						var item = sandwichItems[i];
						var quantity = item.quantity || 0;
						var total = item.total || 0;
						orderCSVData.push(['', quantity, item.title, '$' + total.toFixed(2), '']);
						orderData.total += total;
					}

					orderCSVData.push([]);
					orderCSVData.push(['Salads', '', '', '', '']);
					for (var i = 0; i < saladItems.length; i++) {
						var item = saladItems[i];
						var quantity = item.quantity || 0;
						var total = item.total || 0;
						orderCSVData.push(['', quantity, item.title, '$' + total.toFixed(2), '']);
						orderData.total += total;
					}

					orderCSVData.push([]);
					orderCSVData.push(['Snacks', '', '', '', '']);
					for (var i = 0; i < snackItems.length; i++) {
						var item = snackItems[i];
						var quantity = item.quantity || 0;
						var total = item.total || 0;
						orderCSVData.push(['', quantity, item.title, '$' + total.toFixed(2), '']);
						orderData.total += total;
					}

					orderCSVData.push([]);
					orderCSVData.push(['', 'Grand total:', '', '$' + orderData.total.toFixed(2), '']);
					orderCSVData.push([]);
					orderCSVData.push(['', '', 'PLEASE BRING KETCHUP EVERYDAY - THANK YOU', '', '']);
					orderCSVData.push([]);
					orderCSVData.push(['', '', 'Please send condiments today', '', '']);

					return Promise.join(csv.generate(orderCSVData).then(function(csv) {
						return csv;
					}), csv.generate(customerCSVData).then(function(csv) {
						return csv;
					}), function(orderCSV, customerCSV) {
						return {
							orderCSV: orderCSV,
							customerCSV: customerCSV
						};
					});
				})
				.catch(function() {
					console.error(arguments);
				});
		});
}

function emailCSV(csvContents) {
	var today = new Date();

	console.log('Today\'s CSVs:\n', csvContents);

	var options = {
		to: 'ibiala@ctemc.org',
		subject: 'HTHS Lunch Orders ' + today.toDateString().replace(/\s/g, '-'),
		text: 'Attached are the CSV files for today\'s orders. To print the orders with borders and nicer formatting, click on the attachment in this email to open the preview, then click the printer icon at the top of the preview. If you have any questions, please feel free to contact ibiala@ctemc.org (Ilan Biala).',
		html: 'Attached are the CSV files for today\'s orders. To print the orders with cell borders and nice formatting, click on the attachment in this email to open the preview, then click the printer icon at the top of the preview. If you have any questions, please feel free to contact ibiala@ctemc.org (Ilan Biala).',
		attachments: [{
			filename: 'HTHS-bcc-' + today.toDateString().replace(/\s/g, '-') + '.csv',
			content: csvContents.orderCSV
		}, {
			filename: 'HTHS-orders-' + today.toDateString().replace(/\s/g, '-') + '.csv',
			content: csvContents.customerCSV
		}]
	};

	var email = new Email(options);

	email
		.send()
		.then(function(info) {
			console.log('Sent CSVs for ', today.toDateString());
			console.log(info);
		})
		.catch(function(err) {
			console.error(err);
		});
}

exports.endSubmissionsForDay = function() {
	var today = new Date();
	var yesterday = later.schedule(exports.schoolDays).prev(2, today)[1];
	yesterday.setSeconds(1);

	console.log('Ending submissions for this period from %s to %s', yesterday.toUTCString(), today.toUTCString());

	orders.between(new Date(0), today)
		.then(createDay)
		.then(createCSVInput)
		.then(emailCSV)
		.catch(function(err) {
			console.error('Error: ', err);
		});
}
