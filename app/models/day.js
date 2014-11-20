/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Day Schema
 */
var DaySchema = new Schema({
	date: {
		type: Date,
		default: Date.now
	},
	orders: {
		type: [Schema.ObjectId],
		ref: 'Order',
		required: true
	}
});

mongoose.model('Day', DaySchema);
