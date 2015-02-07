var path = require('path'),
	passport = require('passport'),
	User = require('mongoose').model('User'),
	config = require('./config');

module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User
			.findById(id)
			.populate('orderHistory')
			.exec(function(err, user) {
				done(err, user);
			});
	});

	if (process.env.NODE_ENV === 'test') {
		require('./strategies/mock')();
	} else {
		require('./strategies/google')();
	}
};
