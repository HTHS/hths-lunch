/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Item = mongoose.model('Item'),
	Email = require('./email'),
	item = require('./item'),
	order = require('./order'),
	schedule = require('./schedule'),
	analytics = require('./analytics'),
	user = require('./user'),
	errorHandler = require('./error');

exports.getItems = function(req, res) {
	item.list(req, res);
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

exports.updateSchedule = function(req, res) {
	schedule.update(req, res);
};

exports.getTopItems = function(req, res) {
	analytics.topItems(req, res);
};

exports.getDays = function(req, res) {
	analytics.getDays(req, res);
};

exports.getUsers = function(req, res) {
	user.list(req, res);
};

exports.inviteUser = function(req, res) {
  var url = req.headers.origin + '/auth/google';
	var status = req.body.status || false;

	var stateParams = encodeURIComponent(JSON.stringify({
		isAdmin: req.body.status
	}));
	url += '?state=' + stateParams;

	var options = {
		to: req.body.email,
		subject: 'Join HTHS-Lunch',
		text: 'Join HTHS-Lunch (' + url +
			') and start ordering lunch the right way.',
		html: 'Join <a href="' + url +
			'">HTHS-Lunch</a> and start ordering lunch the right way.'
	};

	var email = new Email(options);
	email
		.send()
		.then(function(info) {
			res.json({
				success: true,
				response: info
			});
		})
		.catch(function(err) {
			res.status(500).json({
				success: false,
				error: err
			});
		});
};

/**
 * Authorization check
 */
exports.userHasAuthorization = function(req, res, next) {
	user.hasAuthorization(req, res);
};

/**
 * Item middleware
 */
exports.itemByID = function(req, res, next, id) {
	item.itemByID(req, res, next, id);
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) {
	order.orderByID(req, res, next, id);
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	user.userByID(req, res, next, id);
};

/**
 * Require login middleware
 */
exports.requiresLogin = function(req, res, next) {
	user.requiresLogin(req, res, next);
};

/**
 * Panel authorization middleware
 */
exports.requiresAuthentication = function(req, res, next) {
	user.requiresAuthentication(req, res, next);
};
