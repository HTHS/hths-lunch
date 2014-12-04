var router = require('express').Router(),
	panel = require('../controllers/panel');

router.all('*', panel.requiresLogin, panel.requiresAuthentication);

// Item Routes
router.route('/api/panel/items')
	.get(panel.getItems)
	.post(panel.createItem);

router.route('/api/panel/items/:itemId')
	.get(panel.getItem)
	.put(panel.updateItem)
	.delete(panel.deleteItem);

// Lunch order routes
router.route('/api/panel/orders')
	.get(panel.getOrders);

router.route('/api/panel/orders/:orderId')
	.get(panel.getOrder)
	.delete(panel.deleteOrder);

// Schedule routes
router.route('/api/panel/schedule')
	.get(panel.getSchedule)
	.post(panel.createSchedule)
	.put(panel.updateSchedule);

// Users routes
router.route('/api/panel/users')
	.get(panel.getUsers)
	.post(panel.inviteUser);

router.route('/api/panel/auth/:user')
	.post(panel.userHasAuthorization);

router.param('itemId', panel.itemByID);
router.param('orderId', panel.orderByID);
router.param('user', panel.userByID);

module.exports.basePath = '/';
module.exports.router = router;
