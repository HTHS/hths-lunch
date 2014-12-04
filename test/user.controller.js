/**
 * Module dependencies
 */

var should = require('should'),
	mongoose = require('mongoose'),
	request = require('supertest'),
	User = mongoose.model('User'),
	user = require('../app/controllers/user');

// TODO finish tests

/**
 * Unit tests
 */
describe('User controller unit tests:', function() {
	before(function(done) {
		request = request('http://localhost:3001');

		done();
	});

	describe('Creating an User', function() {
		// it('should invite a User when not authenticated', function(done) {
		// 	request
		// 		.post('/api/panel/users')
		// 		.set('Content-Type', 'application/json')
		// 		.expect(200)
		// 		.end(function(err, res) {
		// 			if (err) {
		// 				return done(err);
		// 			}
		//
		// 			done();
		// 		});
		// });

		it('fails to create a User with missing field', function(done) {
			done();
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});
