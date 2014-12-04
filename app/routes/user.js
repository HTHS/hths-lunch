/**
 * Module dependencies.
 */
var router = require('express').Router(),
	passport = require('passport'),
	users = require('../controllers/user');

// User Routes

// User profile API
router.route('/api/users/me').get(users.me);
router.route('/api/users/:userId').put(users.update);

// TODO better route
router.route('/api/users/hasAccount').post(users.emailHasAccount);

// User Authentication API
// Logout link
router.route('/api/auth/signout').get(users.signout);

// Google OAuth routes
// "Signup" link
router.route('/auth/google').get(passport.authenticate('google', {
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email',
		'https://www.googleapis.com/auth/plus.login'
	]
}));

// "Callback/Signin" link
router.route('/auth/callback').get(users.signin('google'));

// User middleware
router.param('userId', users.userByID);

module.exports.basePath = '/';
module.exports.router = router;
