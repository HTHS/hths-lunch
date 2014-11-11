/**
 * Module dependencies.
 */
var config = require('./config'),
	chalk = require('chalk'),
	path = require('path'),
	mongoose = require('mongoose');

// Load the mongoose models
module.exports.loadModels = function() {
	// Globbing model files
	config.getGlobbedPaths('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});
};

// Initialize Mongoose
module.exports.connect = function(cb) {
	var db = mongoose.connect(config.db, function(err) {
		// Log Error
		if (err) {
			console.error(chalk.red('Could not connect to MongoDB!'));
			console.log(err);
		} else {
			console.error(chalk.green('Connected to MongoDB.'));

			// Load modules
			module.exports.loadModels();

			// Call callback FN
			if (cb) {
				cb(db);
			}
		}
	});
};

module.exports.disconnect = function() {
	mongoose.disconnect();
};
