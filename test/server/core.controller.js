/**
 * Module dependencies
 */
var should = require('should'),
  request = require('supertest')('http://localhost:3001');

/**
 * Unit tests
 */
describe('Core controller unit tests:', function() {
  before(function(done) {
    done();
  });

  describe('Loading the homepage', function() {
    it('should return 200 from GET /', function(done) {
      request
        .get('/')
        .expect(302)
        .end(function(err, res) {
          request
            .get('/')
            .expect(200, done);
        });
    });

    it('should return an HTML page', function(done) {
      request
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });
  });

  after(function(done) {
    done();
  });
});
