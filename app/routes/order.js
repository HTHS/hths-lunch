var router = require('express').Router(),
	user = require('../controllers/user'),
	order = require('../controllers/order');

// Order Routes
router.route('/')
	.post(user.requiresLogin, order.create);

router.route('/:orderId')
	.get(user.requiresIdentity, order.read)
	.put(user.requiresIdentity, order.update)
	.delete(user.requiresIdentity, order.delete);

// Finish by binding the Item middleware
router.param('orderId', order.orderByID);

module.exports.basePath = '/api/orders';
module.exports.router = router;
