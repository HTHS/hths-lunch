/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../controllers/user');

	// User profile API
	app.route('/api/users/me').get(users.me);
	app.route('/api/users/:userId').put(users.update);

	// User Authentication API
	// Logout link
	app.route('/api/auth/signout').get(users.signout);

	// Google OAuth routes
	// "Signup" link
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/plus.login'
		]
	}));
	// "Callback/Signin" link
	app.route('/auth/callback').get(users.signin('google'));

	// User middleware
	app.param('userId', users.userByID);
};
