/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Post Schema
 */
var DaySchema = new Schema({
	date: {
		type: Date,
		required: true
	},
	orders: {
		type: [Schema.ObjectId],
		ref: 'Order'
	}
});

mongoose.model('Day', DaySchema);
