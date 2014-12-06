/**
 * Module dependencies
 */

var should = require('should'),
	request = require('supertest');

/**
 * Unit tests
 */
describe('Core controller unit tests:', function() {
	before(function(done) {
		request = request('http://localhost:3001');

		done();
	});

	describe('Loading the homepage', function() {
		it('should return 200 from GET /', function(done) {
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