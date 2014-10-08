module.exports = function(app) {
	var order = require('../controllers/order');

	// Item Routes
	app.route('/api/orders')
		.get(order.list)
		.post(order.create);

	app.route('/api/orders/:orderId')
		.get(order.read)
		.put(order.update)
		.delete(order.delete);

	// Finish by binding the Item middleware
	app.param('orderId', order.orderByID);
};
