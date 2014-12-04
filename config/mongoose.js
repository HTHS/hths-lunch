/**
 * Module dependencies.
 */
var chalk = require('chalk'),
	Promise = require('bluebird'),
	path = require('path'),
	mongoose = require('mongoose'),
	config = require('./config');

// Load the mongoose models
exports.loadModels = function() {
	// Globbing model files
	config
		.getGlobbedPaths('./app/models/**/*.js')
		.forEach(function(modelPath) {
			require(path.resolve(modelPath));
		});
};

// Initialize Mongoose
exports.connect = function() {
	var p = Promise.defer();

	var db = mongoose.connect(config.db, function(err) {
		// Log Error
		if (err) {
			console.log(chalk.red('Could not connect to MongoDB!'));
			console.error(err);
			p.reject(err);
		} else {
			console.log(chalk.green('Connected to MongoDB.'));

			// Load modules
			exports.loadModels();

			p.resolve(db);
		}
	});

	return p.promise;
};

exports.disconnect = function() {
	mongoose.disconnect();
	console.info(chalk.yellow('Disconnected from MongoDB.'));
};
