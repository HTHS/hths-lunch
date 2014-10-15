var later = require('later');

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
		.next(365, startDate, endDate);

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
	// var ordersForTheDay =
	//
	// Order.find({}).where('timestampe').lt(date 9:00 AM).gt(date 9:01 AM).sort('timestamp').exec(function)
}
