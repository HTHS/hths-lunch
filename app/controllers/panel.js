/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Item = mongoose.model('Item'),
	item = require('./item'),
	order = require('./order'),
	schedule = require('./schedule'),
	errorHandler = require('./error');

exports.getItems = function(req, res) {
	/**
	 * TODO see how to just use item.list
	 */
	Item.find().sort('-active').sort('title').exec(function(err, items) {
		if (err) {
			return res.send(400, {
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(items);
		}
	});
};

exports.createItem = function(req, res) {
	item.create(req, res);
};

exports.getItem = function(req, res) {
	item.read(req, res);
};

exports.updateItem = function(req, res) {
	item.update(req, res);
};

exports.deleteItem = function(req, res) {
	item.delete(req, res);
};

exports.getOrders = function(req, res) {
	order.list(req, res);
};

exports.getOrder = function(req, res) {
	order.read(req, res);
};

exports.deleteOrder = function(req, res) {
	order.delete(req, res);
};

exports.createSchedule = function(req, res) {
	schedule.create(req, res);
};

exports.getSchedule = function(req, res) {
	schedule.read(req, res);
};

exports.itemByID = function(req, res, next, id) {
	item.itemByID(req, res, next, id);
};

exports.orderByID = function(req, res, next, id) {
	order.orderByID(req, res, next, id);
};
