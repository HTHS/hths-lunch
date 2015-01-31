/**
 * Module dependencies
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Promise = require('bluebird'),
	Email = require('../../app/controllers/email');

/**
 * Unit tests
 */
describe('Email helper logic unit tests:', function() {
	before(function(done) {
		done();
	});

	describe('Creating an Email', function() {
		it('Has sane defaults', function(done) {
			var options = {};

			var email = new Email(options);

			(email instanceof Email).should.be.true;
			email.email.should.eql({
				from: 'HTHS Lunch Autobot <autobot@hths-lunch.tk>'
			});
			email.isSent.should.not.be.true;

			done();
		});

		it('Returns an instance of the Email class', function(done) {
			var options = {
				from: 'test@test.co',
				to: 'test@test.co',
				subject: 'Testing email service',
				text: 'Testing email service text',
				html: 'Testing email service HTML'
			};

			var email = new Email(options);

			(email instanceof Email).should.be.true;
			email.email.should.eql(options);
			email.isSent.should.not.be.true;

			done();
		});
	});

	describe('Sending an Email', function() {
		it('Returns a promise', function(done) {
			var options = {
				to: 'test@test.co',
				subject: 'Testing email service',
				text: 'Testing email service text',
				html: 'Testing email service HTML'
			};

			var email = new Email(options);
			var promise = email.send();
			(promise instanceof Promise).should.be.true;

			done();
		});

		it('Sends an email and updates properties in the object', function(done) {
			var options = {
				to: 'test@test.co',
				subject: 'Testing email service',
				text: 'Testing email service text',
				html: 'Testing email service HTML'
			};

			var email = new Email(options);
			email
				.send()
				.then(function(info) {
					email.isSent.should.be.true;
					done();
				})
				.catch(function(err) {
					done(err);
				});
		});
	});

	after(function(done) {
		done();
	});
});
