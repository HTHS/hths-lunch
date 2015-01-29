var stringify = require('csv-stringify'),
	parse = require('csv-parse'),
	Promise = require('bluebird');

exports.generate = function(input) {
	var p = Promise.defer();

	stringify(input, function(err, output) {
		if (err) {
			p.reject(err);
		} else {
			p.resolve(output);
		}
	});

	return p.promise;
};

exports.parse = function(csv) {
	var p = Promise.defer();

	parse(csv, {
			columns: true
		},
		function(err, output) {
			if (err) {
				p.reject(err);
			} else {
				p.resolve(output);
			}
		});

	return p.promise;
};
