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
		clientID: 'APP_ID',
		clientSecret: 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
};
