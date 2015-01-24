var router = require('express').Router(),
  item = require('../controllers/item');

// Item Routes
router.route('/')
  .get(item.list);

router.route('/:itemId')
  .get(item.read);

// Finish by binding the Item middleware
router.param('itemId', item.itemByID);

module.exports.basePath = '/api/items';
module.exports.router = router;
