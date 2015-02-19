/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Promise = require('bluebird'),
  User = mongoose.model('User'),
  schedule = require('../app/controllers/schedule');

var p1 = new Promise(function(resolve, reject) {
  User
    .count({})
    .exec(function(err, count) {
      if (err) {
        reject({
          error: err
        });
        console.log(err);
        throw new Error(err);
      }

      resolve({
        userCount: count
      });
    });
});

var p2 = schedule.init();

module.exports = Promise.all([p1, p2]);
