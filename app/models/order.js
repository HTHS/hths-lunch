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
	items: [{
		type: Schema.ObjectId,
		ref: 'Item'
	}],
	quantity: [{
		type: Number
	}],
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
