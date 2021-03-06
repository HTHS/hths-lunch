var router = require('express').Router(),
  cache = require('../controllers/cache'),
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

router.route('/schedule/raw')
  .get(panel.getRawSchedule);

// Analytics routes
router.route('/analytics')
  // .get(panel.getTopItems);

router.route('/analytics/top-items')
  .get(cache.untilNextSubmission, panel.getTopItems);

router.route('/analytics/days')
  .get(cache.untilNextSubmission, panel.getDays);

// Users routes
router.route('/users')
  .post(panel.inviteUser)
  .get(panel.getUsers);

router.route('/users/bulk')
  .post(panel.inviteBulkUsers);

router.route('/users/:userId')
  .delete(panel.deleteUser);

router.route('/auth/:userId')
  .post(panel.userHasAuthorization);

router.param('itemId', panel.itemByID)
  .param('orderId', panel.orderByID)
  .param('userId', panel.userByID);

module.exports.basePath = '/api/panel';
module.exports.router = router;
