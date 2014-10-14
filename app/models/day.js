/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
/**
 * Post Schema
 */
var DaySchema = new Schema({
	date: {
		type: Date,
		required: true
	},
	orders: [{
		type: ObjectId,
		ref: 'Order'
	}]
});

mongoose.model('Day', DaySchema);
