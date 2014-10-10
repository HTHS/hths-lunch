var later = require('later');

// Use EDT for calculating start end days of school year
later.date.localTime();

// every weekday in Sept - June at 9 AM
var schoolYear = later.parse.recur().on(9).hour().on(1, 2, 3, 4, 5, 6, 9, 10, 11, 12).month();
var schoolDays = later.parse.recur().on(9).hour().onWeekday().on(1, 2, 3, 4, 5, 6, 9, 10, 11, 12).month();

var schoolYearSched = later.schedule(schoolYear).next(310);
var schoolSched = later.schedule(schoolDays).next(240);

// schoolDays = schoolDays.except().on(310).dayOfYear();
// for skipping days
//
// schoolSched = later.schedule(schoolDays);

exports.read = function(req, res) {
	// res.jsonp({
	// 	weekdays: schoolSched,
	// 	week: schoolYearSched
	// });
	res.jsonp(schoolSched);
};
