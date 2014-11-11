/**
 * Module dependencies.
 */
var chalk = require('chalk'),
	init = require('./config/init')(),
	config = require('./config/config'),
	express = require('./config/express'),
	mongoose = require('./config/mongoose');

mongoose.connect(function(db) {
	var app = express(db);

	// Bootstrap passport config
	require('./config/passport')();

	// Start the app by listening on <port>
	exports = module.exports = app.listen(config.port);

	// Logging initialization
	console.log(chalk.green('Application started on port ' + config.port));
});
