/**
 * Module dependencies
 */
var should = require('should'),
	mongoose = require('mongoose'),
	request = require('supertest')('http://localhost:3001'),
	User = mongoose.model('User'),
	user = require('../../app/controllers/user');

	// router.route('/api/users/me').get(users.requiresLogin, users.me);
	// router.route('/api/users/:userId').put(users.requiresLogin, users.requiresIdentity, users.update);
	//
	// router.route('/api/users/requestInvite').post(users.requestInvite);
	// router.route('/api/users/hasAccount').post(users.emailHasAccount);
	//
	// // User Authentication API
	// // Logout link
	// router.route('/api/auth/signout').get(users.requiresLogin, users.signout);
	//
	// // Google OAuth routes
	// // "Signup" link
	// router.route('/auth/google').get(function(req, res) {
	// 	(passport.authenticate('google', {
	// 		scope: [
	// 			'https://www.googleapis.com/auth/userinfo.profile',
	// 			'https://www.googleapis.com/auth/userinfo.email',
	// 			'https://www.googleapis.com/auth/plus.login'
	// 		],
	// 		state: req.query.state
	// 	}))(req, res);
	// });
	//
	// if (process.env.NODE_ENV === 'test') {
	// 	router.route('/auth/mock').post(function(req, res) {
	// 		(passport.authenticate('mock', {
	// 			user: req.body
	// 		}, function(err, user, info) {
	// 			if (err || !user) {
	// 				return res.status(500).json({
	// 					success: false
	// 				});
	// 			}
	//
	// 			res.json({
	// 				success: true,
	// 				user: user
	// 			});
	// 		}))(req, res);
	// 	});
	// }
	//
	// // "Callback/Signin" link
	// router.route('/auth/callback').get(users.signin('google'));
	// router.route('/auth/mock/callback').get(users.signin('mock'));

/**
 * Unit tests
 */
describe('User controller unit tests:', function() {
	before(function(done) {
		done();
	});

	describe('User API static requests', function() {
		describe('User checking', function() {
			it('should return false when an email that is not used is given', function(done) {
				request
					.post('/api/users/hasAccount')
					.send({
						email: 'abc@xyz.co'
					})
					.expect('Content-Type', /json/)
					.expect(200)
					.end(function(err, res) {
						if (err) {
							return done(err);
						}

						res.body.should.eql({
							hasAccount: false
						});

						done();
					});
			});

			// it('should return true when an email that is not used is given', function(done) {
			// 	request
			// 		.post('/api/users/hasAccount')
			// 		.send({
			// 			email: 'abc@xyz.co'
			// 		})
			// 		.expect('Content-Type', /json/)
			// 		.expect(200)
			// 		.end(function(err, res) {
			// 			if (err) {
			// 				return done(err);
			// 			}
			//
			// 			console.log(res.body);
			//
			// 			done();
			// 		});
			// });
		});

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
