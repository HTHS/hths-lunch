var router = require('express').Router(),
  order = require('../controllers/order');

// Order Routes
router.route('/')
  .get(order.list)
  .post(order.create);

router.route('/:orderId')
  .get(order.read)
  .put(order.update)
  .delete(order.delete);

// Finish by binding the Item middleware
router.param('orderId', order.orderByID);

module.exports.basePath = '/api/orders';
module.exports.router = router;
