/**
 * Module dependencies.
 */
var _ = require('lodash'),
	glob = require('glob'),
	chalk = require('chalk'),
	path = require('path');

(function() {
	/**
	 * Before we begin, lets set the environment variable
	 * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
	 */
	glob('./config/env/' + process.env.NODE_ENV + '.js', {
		sync: true
	}, function(err, environmentFiles) {
		if (!environmentFiles.length) {
			if (process.env.NODE_ENV) {
				console.error(chalk.red('No configuration file found for "' + process.env
					.NODE_ENV + '" environment using development instead'));
			} else {
				console.error(chalk.red(
					'NODE_ENV is not defined! Using default development environment'));
			}

			process.env.NODE_ENV = 'development';
		} else {
			console.log(chalk.inverse('Application loaded using the "' + process.env.NODE_ENV +
				'" environment configuration'));
		}
		console.log(chalk.reset(''));
	});
})();

/**
 * Load app configurations
 */
module.exports = _.extend(
	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}
);

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedPaths = function(globPatterns, excludes) {
	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, this.getGlobbedPaths(globPattern, excludes));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			glob(globPatterns, {
				sync: true
			}, function(err, files) {
				if (excludes) {
					files = files.map(function(file) {
						if (_.isArray(excludes)) {
							for (var i in excludes) {
								file = file.replace(excludes[i], '');
							}
						} else {
							file = file.replace(excludes, '');
						}

						return file;
					});
				}

				output = _.union(output, files);
			});
		}
	}

	return output;
};
