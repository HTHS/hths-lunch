module.exports = function(app) {
	var item = require('../controllers/item');

	// Item Routes
	app.route('/api/items')
		.get(item.list)
		.post(item.create);

	app.route('/api/items/:itemId')
		.get(item.read)
		.put(item.update)
		.delete(item.delete);

	// Finish by binding the Item middleware
	app.param('itemId', item.itemByID);
};