/**
* Module dependencies.
*/
var schedule = require('./schedule');

exports.until = function(req, res, next, until) {
	if (!res.getHeader('Cache-Control')) {
		res.setHeader('Cache-Control', 'public');
		res.setHeader('Expires', until);
	}

	next();
};

exports.untilNextSubmission = function(req, res, next) {
	console.log('Next day: ', schedule.getNextDay());
	exports.until(req, res, next, schedule.getNextDay());
};
