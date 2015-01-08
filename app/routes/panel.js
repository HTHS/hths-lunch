var router = require('express').Router(),
  panel = require('../controllers/panel');

router.all('*', panel.requiresLogin, panel.requiresAuthentication);

// Item Routes
router.route('/items')
  .get(panel.getItems)
  .post(panel.createItem);

router.route('/items/:itemId')
  .get(panel.getItem)
  .put(panel.updateItem)
  .delete(panel.deleteItem);

// Lunch order routes
router.route('/orders')
  .get(panel.getOrders);

router.route('/orders/:orderId')
  .get(panel.getOrder)
  .delete(panel.deleteOrder);

// Schedule routes
router.route('/schedule')
  .get(panel.getSchedule)
  .post(panel.createSchedule)
  .put(panel.updateSchedule);

// Analytics routes
router.route('/analytics')
  .get(panel.getTopItems);

router.route('/analytics/top-items')
  .get(panel.getTopItems);

router.route('/analytics/days')
  .get(panel.getDays);

// Users routes
router.route('/users')
  .get(panel.getUsers)
  .post(panel.inviteUser);

router.route('/users/:userId')
  .delete(panel.deleteUser);

router.route('/auth/:userId')
  .post(panel.userHasAuthorization);

router.param('itemId', panel.itemByID)
  .param('orderId', panel.orderByID)
  .param('userId', panel.userByID);

module.exports.basePath = '/api/panel';
module.exports.router = router;
