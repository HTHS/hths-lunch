var passport = require('passport'),
	User = require('mongoose').model('User'),
	path = require('path'),
	config = require('./config');

module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function(err, user) {
			done(err, user);
		});
	});

	// Initialize strategies
	var url = require('url'),
		GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
		users = require('../app/controllers/user');


	// Use google strategy
	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				profilePic: providerData.picture,
				hd: providerData.hd,
				provider: 'google',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.createProfile(req, providerUserProfile, done);
		}
	));

};
