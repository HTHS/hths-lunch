/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	nodemailer = require('nodemailer'),
	Item = mongoose.model('Item'),
	config = require('../../config/config'),
	item = require('./item'),
	order = require('./order'),
	schedule = require('./schedule'),
	user = require('./user'),
	errorHandler = require('./error');

var transporter = nodemailer.createTransport(config.mailer.options);

exports.getItems = function(req, res) {
	/**
	 * TODO see how to just use item.list
	 */
	Item.find().sort('-active').sort('title').exec(function(err, items) {
		if (err) {
			return res.status(400).send({
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

exports.updateSchedule = function(req, res) {
	schedule.update(req, res);
};

exports.getUsers = function(req, res) {
	user.list(req, res);
};

exports.inviteUser = function(req, res) {
	var url = 'http://hths-lunch.tk/auth/google';
	var status = req.body.status || false;

	var stateParams = encodeURIComponent(JSON.stringify({
		isAdmin: req.body.status
	}));
	url += '?state=' + stateParams;

	transporter.sendMail({
		from: config.mailer.from,
		to: req.body.email,
		subject: 'Join HTHS-Lunch',
		// TODO figure out how to do it for text-only clients
		text: 'Join HTHS-Lunch (' + url + ') and start ordering lunch the right way.',
		html: 'Join <a href="' + url + '">HTHS-Lunch</a> and start ordering lunch the right way.'
	}, function(err, info) {
		if (err) {
			console.log(err);

			res.status(500).json({
				success: false,
				response: {
					message: err.message,
					code: err.code
				}
			});
		} else {
			console.log('Message sent: ' + info.response);

			res.json({
				success: true,
				response: info
			});
		}
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
