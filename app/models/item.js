/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Post Schema
 */
var ItemSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	active: {
		type: Boolean,
		default: true
	}
});

mongoose.model('Item', ItemSchema);