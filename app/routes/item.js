var router = require('express').Router(),
	item = require('../controllers/item');

// Item Routes
router.route('/')
	.get(item.list)
	.post(item.create);

router.route('/:itemId')
	.get(item.read)
	.put(item.update)
	.delete(item.delete);

// Finish by binding the Item middleware
router.param('itemId', item.itemByID);

module.exports.basePath = '/api/items';
module.exports.router = router;
