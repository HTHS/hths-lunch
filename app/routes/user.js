/**
 * Module dependencies.
 */
var router = require('express').Router(),
	passport = require('passport'),
	users = require('../controllers/user');

// User Routes

// User profile API
router.route('/api/users/me').get(users.requiresLogin, users.me);
router.route('/api/users/:userId').put(user.requiresLogin, users.requiresIdentity, users.update);

router.route('/api/users/requestInvite').post(users.requestInvite);
router.route('/api/users/hasAccount').post(users.emailHasAccount);

// User Authentication API
// Logout link
router.route('/api/auth/signout').get(users.requiresLogin, users.signout);

// Google OAuth routes
// "Signup" link
router.route('/auth/google').get(function(req, res) {
	(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/plus.login'
		],
		state: req.query.state
	}))(req, res);
});

// "Callback/Signin" link
router.route('/auth/callback').get(users.signin('google'));

// User middleware
router.param('userId', users.userByID);

module.exports.basePath = '/';
module.exports.router = router;
