/**
 * Module dependencies
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Unit tests
 */
describe('User model unit tests:', function() {
	before(function(done) {
		done();
	});

	describe('Creating an User', function() {
		it('should create and save an User', function(done) {
			var user = new User({
				firstName: 'Test',
				lastName: 'User',
				displayName: 'Test User',
				email: 'testuser@gmail.com',
				provider: 'local'
			});

			user.save(done);
		});

		it('fails to create an User with missing field', function(done) {
			var user = new User({
				firstName: 'Test',
				lastName: 'User',
				displayName: 'Test User',
				email: null, // missing
				provider: 'local'
			});

			user.save(function(err) {
				(err !== null).should.be.true;
				done();
			});
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});