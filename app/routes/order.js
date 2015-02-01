var router = require('express').Router(),
  user = require('../controllers/user'),
  order = require('../controllers/order');

// Order Routes
router.route('/')
  .post(user.requiresLogin, order.create);

router.route('/:orderId')
  .get(user.requiresLogin, user.requiresIdentity, order.read)
  .put(user.requiresLogin, user.requiresIdentity, order.update)
  .delete(user.requiresLogin, user.requiresIdentity, order.delete);

// Finish by binding the Item middleware
router.param('orderId', order.orderByID);

module.exports.basePath = '/api/orders';
module.exports.router = router;
