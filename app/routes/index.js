module.exports = function(app) {
	var core = require('../controllers/core');

	app.route('/')
		.get(core.index);
};