/**
 * Module dependencies.
 */
var chalk = require('chalk'),
	_ = require('lodash'),
	config = require('./config/config'),
	express = require('./config/express'),
	mongoose = require('./config/mongoose');

exports.start = function() {
	mongoose
		.connect()
		.then(function(db) {
			var app = express(db);
			var options = require('./config/options');

			// Bootstrap passport config
			require('./config/passport')();

			// Logging initialization
			console.log(chalk.green('Application started on port ' + config.port));

			// Start the app by listening on <port>
			exports.server = app.listen(config.port);
		});
};

exports.kill = function() {
	exports.server.close();
	mongoose.disconnect();

	console.log(chalk.red('Application killed. Port %s now available.'), config.port);

	exports.server = null;
};

exports.start();
