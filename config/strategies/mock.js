var passport = require('passport'),
	util = require('util');

function MockStrategy(options, verify) {
	this.name = 'mock';
	this.passAuthentication = options.passAuthentication || true;
	this.userId = options.userId || 1;
	this._verify = verify;
}

util.inherits(MockStrategy, passport.Strategy);

MockStrategy.prototype.authenticate = function(req, options) {
	var username = 'testuser';
	var password = 'testuser';
	var self = this;
	options = options || {};

	function verified(err, user, info) {
		if (err) {
			return self.error(err);
		}
		if (!user) {
			return self.fail(info);
		}
		self.success(user, info);
	}

	try {
		if (self._passReqToCallback) {
			this._verify(req, username, password, verified);
		} else {
			this._verify(username, password, verified);
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
	}, function(username, password, cb) {
		cb(null, {
			username: username,
			password: password
		});
	}));
};
