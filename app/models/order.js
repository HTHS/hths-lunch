/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Post Schema
 */
var OrderSchema = new Schema({
	customer: {
		type: String,
		required: true
	},
	items: {
		type: Array,
		required: true
	},
	total: {
		type: Number,
		required: true
	},
	timestamp: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Order', OrderSchema);