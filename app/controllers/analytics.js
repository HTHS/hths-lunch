/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Item = mongoose.model('Item');

/**
 * Order items by number of ordered
 */
exports.topItems = function(req, res) {
	Item
		.find()
		.sort('-ordered')
		.exec(function(err, items) {
			
		});
};
