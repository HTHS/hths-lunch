var router = require('express').Router(),
	order = require('../controllers/order');

// Item Routes
router.route('/api/orders')
	.get(order.list)
	.post(order.create);

router.route('/api/orders/:orderId')
	.get(order.read)
	.put(order.update)
	.delete(order.delete);

// Finish by binding the Item middleware
router.param('orderId', order.orderByID);

module.exports.basePath = '/';
module.exports.router = router;
