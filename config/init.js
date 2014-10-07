/**
 * Module dependencies.
 */
var glob = require('glob'),
	config = require('./config');

/**
 * Module init function.
 */
module.exports = function() {
	/**
	 * Before we begin, lets set the environment variable
	 * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
	 */

	glob('./config/env/' + process.env.NODE_ENV + '.js', {
		sync: true
	}, function(err, environmentFiles) {

		if (!environmentFiles.length) {
			console.log('\x1b[31m', 'No configuration file found for "' + process.env
				.NODE_ENV + '" environment using development instead');
		} else {
			console.log('\x1b[7m', 'Application loaded using the "' + process.env.NODE_ENV +
				'" environment configuration, port', config.port);
		}
		console.log('\x1b[0m');
	});
};