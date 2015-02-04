var passport = require('passport'),
  util = require('util');

function MockStrategy(options, verify) {
  this.name = 'mock';
  this.passAuthentication = options.passAuthentication || true;
  this.userId = options.userId || 1;
  this.verify = verify;
}

util.inherits(MockStrategy, passport.Strategy);

MockStrategy.prototype.authenticate = function authenticate(req) {
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

module.exports = function(app, options) {
  // create your verify function on your own -- should do similar things as the "real" one.
  passport.use(new MockStrategy({
    callbackURL: '/auth/mock'
  }, function(req, accessToken, refreshToken, profile, done) {
    console.log(arguments);
  }));

  app.get('/auth/mock', passport.authenticate('mock'));
};
