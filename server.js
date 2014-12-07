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
			var options = require('./config/options');

			options.then(function(opts) {
				var options = opts.reduce(function(prevObj, currentObj) {
					return _.extend(prevObj, currentObj);
				});

				var app = express(db, options);

				// Bootstrap passport config
				require('./config/passport')();

				// Logging the initialization details
				console.log(chalk.green('%s application started.'), config.app.title);
				console.log(chalk.green('Environment: %s'), process.env.NODE_ENV);
				console.log(chalk.green('Port: %d'), config.port);
				console.log(chalk.green('Database: %s'), config.db);

				// Start the app by listening on <port>
				exports.server = app.listen(config.port);
			});
		});
};

exports.kill = function() {
	exports.server.close();
	mongoose.disconnect();

	console.log(chalk.red('Application killed. Port %s now available.'), config.port);

	exports.server = null;
};

exports.start();
