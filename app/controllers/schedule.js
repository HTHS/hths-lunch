var later = require('later'),
	mongoose = require('mongoose'),
	Order = mongoose.model('Order'),
	Day = mongoose.model('Day');

// Use ET for calculating start end days of school year
later.date.localTime();

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
	exports.schoolSchedule = later.schedule(exports.schoolDays)
		.next(500, startDate, endDate);

	exports.job = later.setInterval(endSubmissionsForDay, exports.schoolDays);

	res.jsonp(exports.schoolSchedule);
};

exports.read = function(req, res) {
	// res.jsonp({
	// 	weekdays: schoolSched,
	// 	week: schoolYearSched
	// });
	res.jsonp(exports.schoolSchedule);
};

function endSubmissionsForDay() {
	var now = new Date();
	var yesterdayCutoff = new Date(Date.now() - later.DAY);
	yesterdayCutoff.setMinutes(1);
	Order.find({}).where('timestamp').lt(now).gt(yesterdayCutoff).sort('timestamp').exec(function(
		err, orders) {
		if (err) {
			throw new Error(err);
		}
		if (!orders.length) {
			throw new Error('no orders for today');
		} else {
			var orderIDs = orders.map(function(order) {
				return order._id;
			});

			var today = new Day({
				orders: orderIDs
			});

			today.save(function(err) {
				if (err) {
					throw new Error(err);
				} else {
					generateCSV(today);
				}
			});
		}
	});
}

function generateCSV(day) {
	console.log(day);
}
