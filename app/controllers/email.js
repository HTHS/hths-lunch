/**
 * Module dependencies
 */
var nodemailer = require('nodemailer'),
	config = require('../../config/config');

var transporter = nodemailer.createTransport(config.mailer.options);
