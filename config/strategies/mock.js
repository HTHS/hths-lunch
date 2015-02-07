var passport = require('passport'),
  util = require('util');

function MockStrategy(options, verify) {
  this.name = 'mock';
  this.passAuthentication = options.passAuthentication || true;
  this.userId = options.userId || 1;
  this.verify = verify;
}

util.inherits(MockStrategy, passport.Strategy);

MockStrategy.prototype.authenticate = function authenticate(req, options) {
  if (this.passAuthentication) {
    var user = {
      id: this.userId
    };
    var self = this;

    this.verify(user, function(err, user) {
      if (err) {
        self.fail(err);
      } else {
        self.success(user);
      }
    });
  } else {
    this.fail('Unauthorized');
  }
};

module.exports = function() {
  // create your verify function on your own -- should do similar things to the "real" one.
  passport.use(new MockStrategy({
    callbackURL: '/auth/mock'
  }, function(user, cb) {
    cb(null, user);
  }));
};
