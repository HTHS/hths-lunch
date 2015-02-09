var passport = require('passport'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	util = require('util');

function MockStrategy(options, verify) {
	this.name = 'mock';
	this.passAuthentication = options.passAuthentication || true;
	this.userId = options.userId || 1;
	this.user = new User({
		firstName: 'Test',
		lastName: 'User',
		displayName: 'Test User',
		email: 'testuser@gmail.com',
		provider: 'local',
		password: 'testuser',
		isAdmin: true
	});
	this.user.save();
	this._verify = verify;
}

util.inherits(MockStrategy, passport.Strategy);

MockStrategy.prototype.authenticate = function(req, options) {
	var self = this;
	options = options || {};

	function verified(err, user, info) {
		if (err) {
			return self.error(err);
		}
		if (!user) {
			return self.fail(info);
		}
		req.login(user, function(err) {
			if (err) {
				return self.error(err);
			}
			return self.success(user, info);
		});
	}

	try {
		if (self._passReqToCallback) {
			this._verify(req, self.user, verified);
		} else {
			this._verify(self.user, verified);
		}
	} catch (e) {
		return self.error(e);
	}
};

module.exports = function() {
	// create your verify function on your own -- should do similar things to the "real" one.
	passport.use(new MockStrategy({
		callbackURL: '/auth/mock/callback',
		passReqToCallback: true
	}, function(user, cb) {
		cb(null, user);
	}));
};
