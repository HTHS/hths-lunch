/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Promise = require('bluebird'),
	User = mongoose.model('User');

var p1 = new Promise(function(resolve, reject) {
	User
		.count({})
		.exec(function(err, count) {
			if (err) {
				reject({
					error: err
				});
				throw new Error(err);
			}

			resolve({
				userCount: count
			});
		});
});

module.exports = Promise.all([p1]);
