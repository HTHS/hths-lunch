module.exports = {
	app: {
		title: 'HTHS Lunch',
		description: 'Lunch ordering for the 21st century',
		keywords: ''
	},
	port: process.env.PORT || 3000,
	sessionCollection: 'sessions',
	mandrill: {
		username: 'eytanbiala@gmail.com',
		password: process.env.MANDRILL_KEY || 'x8ycfrh8VONrf3ZVzm7o5Q'
	}
};