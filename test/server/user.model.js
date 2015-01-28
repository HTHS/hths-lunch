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

	describe('Creating a User', function() {
		it('should create and save a User', function(done) {
			var user = new User({
				firstName: 'Test',
				lastName: 'User',
				displayName: 'Test User',
				email: 'testuser@gmail.com',
				provider: 'local'
			});

			user.save(done);
		});

		it('should only allow unique emails', function(done) {
			var user = new User({
				firstName: 'Test',
				lastName: 'User',
				displayName: 'Test User',
				email: 'testuser@gmail.com',
				provider: 'local'
			});

			user.save(function(err) {
				(err !== null).should.be.true;
				err.name.should.equal('MongoError');
				err.code.should.equal(11000);

				done();
			});
		});

		it('fails to create a User with missing field', function(done) {
			var user = new User({
				firstName: 'Test',
				lastName: 'User',
				displayName: 'Test User',
				// missing email
				provider: 'local'
			});

			user.save(function(err) {
				(err !== null).should.be.true;
				err.message.should.equal('Validation failed');
				err.errors.email.message.should.equal('Path `email` is required.');

				done();
			});
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});
