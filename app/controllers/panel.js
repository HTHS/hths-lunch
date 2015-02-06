/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Promise = require('bluebird'),
  Item = mongoose.model('Item'),
  Email = require('./email'),
  csv = require('./csv'),
  item = require('./item'),
  order = require('./order'),
  schedule = require('./schedule'),
  analytics = require('./analytics'),
  user = require('./user'),
  errorHandler = require('./error');

exports.getItems = function(req, res) {
  item.list(req, res);
};

exports.createItem = function(req, res) {
  item.create(req, res);
};

exports.getItem = function(req, res) {
  item.read(req, res);
};

exports.updateItem = function(req, res) {
  item.update(req, res);
};

exports.deleteItem = function(req, res) {
  item.delete(req, res);
};

exports.getOrders = function(req, res) {
  order.list(req, res);
};

exports.getOrder = function(req, res) {
  order.read(req, res);
};

exports.deleteOrder = function(req, res) {
  order.delete(req, res);
};

exports.createSchedule = function(req, res) {
  schedule.create(req, res);
};

exports.getSchedule = function(req, res) {
  schedule.read(req, res);
};

exports.getRawSchedule = function(req, res) {
  schedule.getRawSchedule(req, res);
};

exports.updateSchedule = function(req, res) {
  schedule.update(req, res);
};

exports.getTopItems = function(req, res) {
  analytics.topItems(req, res);
};

exports.getDays = function(req, res) {
  analytics.getDays(req, res);
};

exports.getUsers = function(req, res) {
  user.list(req, res);
};

exports.deleteUser = function(req, res) {
  user.delete(req, res);
};

exports.inviteUser = function(req, res) {
  var email = req.body.email;
  var url = req.headers.origin;
  var isAdmin = req.body.isAdmin || false;

  user
    .invite(email, url, isAdmin)
    .then(function(user, err) {
      if (err) {
        // email failed to send, but user was created
        res.status(400).json({
          success: true,
          user: user,
          error: err
        });
      } else {
        res.json(user);
      }
    })
    .catch(function(err) {
      res.status(500).json({
        success: false,
        error: err
      });
    });
};

exports.inviteBulkUsers = function inviteBulkUsers(req, res) {
  var csvFileContents = req.files.users.buffer.toString();
  csv
    .parse(csvFileContents)
    .then(function(users) {
      var newUsers = [];
      var promises = [];

      for (var i = 0; i < users.length; i++) {
        var u = users[i];
        var email = u.EmailAddress;
        var url = req.headers.origin;
        var isAdmin = u.Admin;

        var promise = user.invite(email, url, isAdmin);
        promise
          .then(function(u, err) {
            if (err) {
              // email failed to send, but user was created
              // res.status(400).json({
              // 	success: true,
              // 	user: user,
              // 	error: err
              // });

              newUsers.push(u);
            } else {
              newUsers.push(u);
            }
          })
          .catch(function(err) {
            // res.status(500).json({
            // 	success: false,
            // 	error: err
            // });
            newUsers.push(err);
          });

        promises.push(promise);
      }

      Promise
        .all(promises)
        .then(function() {
          res.json(newUsers);
        });
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).json({
        message: 'An error occurred',
        error: err
      });
    });
};

/**
 * Authorization check
 */
exports.userHasAuthorization = function(req, res, next) {
  user.hasAuthorization(req, res);
};

/**
 * Item middleware
 */
exports.itemByID = function(req, res, next, id) {
  item.itemByID(req, res, next, id);
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) {
  order.orderByID(req, res, next, id);
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
  user.userByID(req, res, next, id);
};

/**
 * Require login middleware
 */
exports.requiresLogin = function(req, res, next) {
  user.requiresLogin(req, res, next);
};

/**
 * Panel authorization middleware
 */
exports.requiresAuthentication = function(req, res, next) {
  user.requiresAuthentication(req, res, next);
};
