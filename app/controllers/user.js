/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Promise = require('bluebird'),
	User = mongoose.model('User'),
	errorHandler = require('./error');

/**
 * Signup
 */
exports.createProfile = function createProfile(req, providerUserProfile, done) {
	email = providerUserProfile.email.replace(/(\S+)\.(\S+@)/, '$1$2');

	if (!req.user) {
		User.findOne({
			email: email
		}).exec(function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					console.log('User doesn\'t exist, profile: ', providerUserProfile);

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
						status: 'Created',
						provider: providerUserProfile.provider,
						providerData: providerUserProfile.providerData
					});

					// Save the user
					user.save(function(err) {
						return done(err, user);
					});
				} else {
					// User already exists, update it
					user = _.extend(user, {
						firstName: providerUserProfile.firstName,
						lastName: providerUserProfile.lastName,
						displayName: providerUserProfile.displayName,
						status: 'Created',
						provider: providerUserProfile.provider,
						providerData: providerUserProfile.providerData
					});

					user.save(function(err) {
						return done(err, user);
					});
				}
			}
		});
	} else {
		return done(null, req.user, '/');
	}
};

exports.requestInvite = function requestInvite(req, res) {
	exports.createPlaceholder(req.body.email, 'Pending invite')
		.then(function(user) {
			res.json(user);
		})
		.catch(function(err) {
			res.status(400).json({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Create placeholder user for invited/requesting users
 * @param {String} email  email address of user
 * @param {String} status status of user
 */
exports.createPlaceholder = function createPlaceholder(email, status) {
	email = email.replace(/(\S+)\.(\S+@)/, '$1$2');

	var p = Promise.defer();

	User.findOne({
		email: email
	}).exec(function(err, user) {
		if (err) {
			console.log(err);
			p.reject(err);
		} else {
			if (!user) {
				var user = new User({
					email: email,
					status: status
				});

				user.save(function(err) {
					if (err) {
						console.log('Error: ', err);
						p.reject(err);
					} else {
						p.resolve(user);
					}
				});
			} else {
				user.update({
					$set: {
						status: 'Invited'
					}
				}, {}, function(err, numberUpdated, result) {
					if (!err) {
						user.status = 'Invited';
						p.resolve(user);
					} else {
						p.reject(err);
					}
				});
			}
		}
	});

	return p.promise;
};

/**
 * Signin after passport authentication
 */
exports.signin = function signin(strategy) {
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
exports.signout = function signout(req, res) {
	req.logout();
	res.json({
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
exports.update = function update(req, res) {
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
exports.makeAdminUser = function makeAdminUser(req, res) {
	req.body = {
		isAdmin: true
	};

	exports.update(req, res);
};

/**
 * Check if email has account
 */
exports.emailHasAccount = function emailHasAccount(req, res) {
	var email = req.body.email.replace(/(\S+)\.(\S+@)/, '$1$2');

	User.findOne({
		email: email
	}).exec(function(err, user) {
		if (err) {
			return res.json({
				message: errorHandler.getErrorMessage(err)
			});
		}
		if (!user) {
			return res.json({
				hasAccount: false
			});
		} else if (user.status === 'Pending invite') {
			return res.json({
				hasAccount: true,
				pending: true
			});
		} else {
			return res.json({
				hasAccount: true,
				pending: false
			});
		}
	});
};

/**
 * User authorization check
 */
exports.hasAuthorization = function hasAuthorization(req, res) {
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
exports.userByID = function userByID(req, res, next, id) {
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
exports.requiresLogin = function requiresLogin(req, res, next) {
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
exports.requiresAuthentication = function requiresAuthentication(req, res, next) {
	if (req.user.isAdmin) {
		next();
	} else {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
};
