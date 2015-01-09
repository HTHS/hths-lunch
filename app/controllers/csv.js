var stringify = require('csv-stringify'),
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
