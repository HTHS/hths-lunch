/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
	customer: {
		type: String,
		required: true
	},
	items: [{
		type: Schema.ObjectId,
		ref: 'Item',
		required: true
	}],
	quantity: [{
		type: Number,
		required: true
	}],
	total: {
		type: Number,
		required: true
	},
	timestamp: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

OrderSchema.pre('save', function(next) {
	this.updated = new Date();
	return next();
});

mongoose.model('Order', OrderSchema);
