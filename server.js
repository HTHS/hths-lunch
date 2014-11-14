/**
 * Module dependencies.
 */
var chalk = require('chalk'),
	config = require('./config/config'),
	express = require('./config/express'),
	mongoose = require('./config/mongoose');

mongoose
	.connect()
	.then(function(db) {
		var app = express(db);

		// Bootstrap passport config
		require('./config/passport')();

		// Logging initialization
		console.log(chalk.green('Application started on port ' + config.port));

		// Start the app by listening on <port>
		app.listen(config.port);
	});
