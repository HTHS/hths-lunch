/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Promise = require('bluebird'),
	User = mongoose.model('User'),
	Email = require('./email'),
	schedule = require('./schedule'),
	errorHandler = require('./error');

/**
 * Signup
 */
exports.createProfile = function createProfile(req, providerUserProfile, done) {
	var email = providerUserProfile.email.replace(/(\S+)\.(\S+@)/, '$1$2');

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
						if (!err) {
							var options = {
								to: user.email,
								subject: 'Welcome to HTHS-Lunch',
								html: [
									'<h2>Welcome to HTHS-Lunch!</h2>',
									'<h4>To get started:</h4>',
									'<ol>',
									'<li>Go to <a href="http://hths-lunch.tk">the website</a>. If you are already logged in, you should be immediately redirected to the order form.</li>',
									'<li>Select whichever items you want and just submit the order by 8 a.m. to receive your food for the next school day.</li>',
									'<li>Update your order from anywhere or cancel your order if you are sick or leaving early.</li>',
									'</ol>',
									'<p>If you have any questions, comments, or feedback, contact <a href="mailto:ilan.biala@gmail.com">Ilan Biala</a>.</p>'
								].join('')
							};

							var welcomeEmail = new Email(options);

							welcomeEmail
								.send()
								.then(function(info) {
									console.log('Welcomed ', user.displayName);
									console.log(info);
								})
								.catch(function(err) {
									console.error(err);
								});
						}

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

/**
 * Request invite and create placeholder user to prevent duplicate requests
 * @param {Object} req Request
 * @param {Object} res Response
 */
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

exports.invite = function(email, url, status) {
	var p = Promise.defer();

	url += '/auth/google?email=' + email;
	var stateParams = encodeURIComponent(JSON.stringify({
		isAdmin: status
	}));
	url += '?state=' + stateParams;

	var options = {
		to: email,
		subject: 'Join HTHS-Lunch',
		text: 'Join HTHS-Lunch (' + url + ') and start ordering lunch the right way.',
		html: 'Join <a href="' + url + '">HTHS-Lunch</a> and start ordering lunch the right way.'
	};

	exports
		.createPlaceholder(email, 'Invited')
		.then(function(user) {
			var email = new Email(options);
			email
				.send()
				.then(function(info) {
					p.resolve(user);
				})
				.catch(function(err) {
					p.resolve(user, err);
				});
		})
		.catch(function(err) {
			p.reject(err);
		});

	return p.promise;
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
				user = new User({
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
	var user = req.user;

	if (user.orderHistory.length) {
		var lastOrder = user.orderHistory[user.orderHistory.length - 1];
		lastOrder.toUpdate = schedule.isBetween(lastOrder.created);
	}

	res.json(user);
};

/**
 * List of Items
 */
exports.list = function(req, res) {
	User
		.find()
		.sort('displayName')
		.sort('email')
		.exec(function(err, users) {
			if (err) {
				return res.status(400).json({
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
				return res.status(400).json({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).json(err);
					} else {
						user.populate('orderHistory', function(err, user) {
							if (err) {
								res.status(500).json({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								res.json(user);
							}
						});
					}
				});
			}
		});
	} else {
		res.status(400).json({
			message: 'User is not signed in'
		});
	}
};

exports.delete = function remove(req, res) {
	User
		.findByIdAndRemove(req.profile._id)
		.exec(function(err, user) {
			if (err) {
				return res.status(500).json({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				return res.json(user);
			}
		});
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
		return res.json({
			authorized: true,
			message: 'User is authorized'
		});
	} else {
		return res.status(403).json({
			authorized: false,
			message: 'User is not authorized'
		});
	}
};

/**
 * User middleware
 */
exports.userByID = function userByID(req, res, next, id) {
	User
		.findById(id)
		.populate('orderHistory')
		.exec(function(err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return next(new Error('No User with ID ' + id + ' found'));
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
		return res.status(401).json({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * Require user logged in to be the same as user being modified routing middleware
 */
exports.requiresIdentity = function requiresIdentity(req, res, next) {
	if (req.profile) {
		if (req.user._id.toString() !== req.profile._id.toString()) { // stringify ObjectId
			return res.status(401).json({
				message: 'Unauthorized operation'
			});
		} else {
			next();
		}
	} else if (req.order) {
		if (req.user._id.toString() !== req.order.user.toString()) { // stringify ObjectId
			return res.status(401).json({
				message: 'Unauthorized operation'
			});
		} else {
			next();
		}
	}
};

/**
 * Require admin priviliges routing middleware
 */
exports.requiresAuthentication = function requiresAuthentication(req, res, next) {
	if (req.user.isAdmin) {
		next();
	} else {
		return res.status(403).json({
			message: 'User is not authorized'
		});
	}
};
