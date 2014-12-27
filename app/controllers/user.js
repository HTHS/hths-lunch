/**
 * Module dependencies.
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  errorHandler = require('./error');

/**
 * Signup
 */
exports.createProfile = function(req, providerUserProfile, done) {
  if (!req.user) {
    // Define search query
    var searchMainProviderIdentifierField = 'providerData.' +
      providerUserProfile.providerIdentifierField;

    var query = {};
    query.provider = providerUserProfile.provider;
    query[searchMainProviderIdentifierField] =
      providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    User.findOne(query, function(err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var isAdmin = false;

          if (req.query.state) {
            isAdmin = JSON.parse(decodeURIComponent(req.query.state)).isAdmin;
          }

          // Create the user
          user = new User({
            firstName: providerUserProfile.firstName,
            lastName: providerUserProfile.lastName,
            displayName: providerUserProfile.displayName,
            email: providerUserProfile.email,
            isAdmin: isAdmin,
            provider: providerUserProfile.provider,
            providerData: providerUserProfile.providerData
          });

          // Save the user
          user.save(function(err) {
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    return done(null, req.user, '/settings/accounts');
  }
};

/**
 * Placholder user for invited users
 */
// TODO implement invited user tracking
// exports.createPlaceholder = function(req, res) {
// 	var user = new User({
// 		email: req.body.email,
// 		status: 'invited'
// 	});
//
// 	user.save(function(err) {
//
// 	});
// };

/**
 * Signin after passport authentication
 */
exports.signin = function(strategy) {
  return function(req, res, next) {
    passport.authenticate(strategy, function(err, user, redirectURL) {
      if (err || !user) {
        return res.redirect('/');
      }

      req.login(user, function(err) {
        if (err) {
          return res.redirect('/');
        }

        return res.redirect(redirectURL || '/order');
      });
    })(req, res, next);
  };
};

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout();
  res.status(200).json({
    success: true
  });
};

/**
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

/**
 * List of Items
 */
exports.list = function(req, res) {
  User
    .find()
    .sort('-created')
    .exec(function(err, users) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(users);
      }
    });
};

/**
 * Update user details
 */
exports.update = function(req, res) {
  var user = req.user;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Syntactic sugar on top of exports.update
 */
exports.makeAdminUser = function(req, res) {
  req.body = {
    isAdmin: true
  };

  exports.update(req, res);
};

/**
 * Check if email has account
 */
exports.emailHasAccount = function(req, res) {
  User.findOne({
    email: req.body.email
  }).exec(function(err, user) {
    if (err) {
      return res.json(err);
    }
    if (!user) {
      return res.json({
        hasAccount: false
      });
    } else {
      return res.json({
        hasAccount: true
      });
    }
  });
};

/**
 * User authorization check
 */
exports.hasAuthorization = function(req, res) {
  if (req.user.isAdmin) {
    return res.send({
      authorized: true,
      message: 'User is authorized'
    });
  } else {
    return res.status(403).send({
      authorized: false,
      message: 'User is not authorized'
    });
  }
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
  User.findOne({
    _id: id
  }).populate('orderHistory').exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('Failed to load User ' + id));
    }
    req.profile = user;
    next();
  });
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }

  next();
};

/**
 * Require Authentication routing middleware
 */
exports.requiresAuthentication = function(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
};
