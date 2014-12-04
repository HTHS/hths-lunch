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
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' +
			providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[
			providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					// Create the user
					user = new User({
						firstName: providerUserProfile.firstName,
						lastName: providerUserProfile.lastName,
						displayName: providerUserProfile.displayName,
						email: providerUserProfile.email,
						isAdmin: JSON.parse(decodeURIComponent(req.query.state)).isAdmin,
						provider: providerUserProfile.provider,
						providerData: providerUserProfile.providerData
					});

					// And save the user
					user.save(function(err) {
						return done(err, user);
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[
				providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

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
	User.find().exec(function(err, users) {
		if (err) {
			return res.send(400, {
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

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
exports.userHasAuthorization = function(req, res) {
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
		next(new Error('User is not authorized'));
	}
};
