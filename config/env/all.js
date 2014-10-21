module.exports = {
	app: {
		title: 'hths-lunch',
		description: 'Lunch orders in the 21st century',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	sessionSecret: '5dvpGV0wulKTQ2Ya',
	sessionCollection: 'sessions',
	google: {
		clientID: '260484967294-qel7tlhafljn7n0c1kqias6s5fnldbv3.apps.googleusercontent.com',
		clientSecret: 'Q7TyFI-lYnTdiTF4r7JFnI1g',
		callbackURL: '/auth/callback'
	},
	mailer: {
		from: 'MAILER_FROM',
		options: {
			service: 'Mandrill',
			auth: {
				user: 'ilanbiala',
				pass: '5rc0a3ydRJkbwFX5qeKq9w'
			}
		}
	}
};
