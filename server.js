/**
 * Main application entry file.
 * Note: the order of loading is important.
 */

/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose');

var express = require('express');
var app = express();

var server = app.listen(3000, function() {
	console.log('Started server on port %d', 3000);
});

// DB connection
var db = mongoose.connect(config.db);

// Init the application
var app = require('./config/express')(db);

// Expose app
exports = module.exports = app;