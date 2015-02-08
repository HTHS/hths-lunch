/**
 * Module dependencies.
 */
var router = require('express').Router(),
	passport = require('passport'),
	users = require('../controllers/user');

// User Routes

// User profile API
router.route('/api/users/me').get(users.requiresLogin, users.me);
router.route('/api/users/:userId').put(users.requiresLogin, users.requiresIdentity, users.update);

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

if (process.env.NODE_ENV === 'test') {
	router.route('/auth/mock').get(
		function(req, res, next) {
			(passport.authenticate('mock', function(err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					return res.status(500).json({
						success: false
					});
				}
				res.json({
					success: true
				});
			}))(req, res, next);
		});
}

// "Callback/Signin" link
router.route('/auth/callback').get(users.signin('google'));
router.route('/auth/mock/callback').get(users.signin('mock'));

// User middleware
router.param('userId', users.userByID);

module.exports.basePath = '/';
module.exports.router = router;
