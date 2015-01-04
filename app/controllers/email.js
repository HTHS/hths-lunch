/**
 * Module dependencies
 */
var _ = require('lodash'),
	nodemailer = require('nodemailer'),
	Promise = require('bluebird'),
	config = require('../../config/config');

var transporter = nodemailer.createTransport(config.mailer.options);

/**
 * Email constructor
 * @param {Object}  email   email object
 */
function Email(email) {
	this.email = _.extend({
		from: config.mailer.from
	}, email);
	this.isSent = false;
}

Email.prototype.send = function() {
	var p = Promise.defer();

	transporter.sendMail(this.email, function(err, info) {
		if (err) {
			p.reject(err);
		} else {
			this.isSent = true;
			p.resolve(info);
		}
	});

	return p.promise;
};

module.exports = Email;
