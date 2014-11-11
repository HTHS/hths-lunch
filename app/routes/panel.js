module.exports = function(app) {
	var panel = require('../controllers/panel');

	// Item Routes
	app.route('/api/panel/items')
		.get(panel.getItems)
		.post(panel.createItem);

	app.route('/api/panel/items/:itemId')
		.get(panel.getItem)
		.put(panel.updateItem)
		.delete(panel.deleteItem);

	// Lunch order routes
	app.route('/api/panel/orders')
		.get(panel.getOrders);

	app.route('/api/panel/orders/:orderId')
		.get(panel.getOrder)
		.delete(panel.deleteOrder);

	app.route('/api/panel/schedule')
		.get(panel.getSchedule)
		.post(panel.createSchedule)
		.put(panel.updateSchedule);

	app.param('itemId', panel.itemByID);
	app.param('orderId', panel.orderByID);
};
