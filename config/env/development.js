module.exports = {
	db: 'mongodb://localhost/hths-lunch-dev',
	app: {
		title: 'hths-lunch - Development Environment'
	},
	google: {
		clientID: 'APP_ID',
		clientSecret: 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	mailer: {
		from: 'MAILER_FROM',
		options: {
			service: 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: 'MAILER_EMAIL_ID',
				pass: 'MAILER_PASSWORD'
			}
		}
	}
};
