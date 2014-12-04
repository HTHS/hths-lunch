var router = require('express').Router(),
	item = require('../controllers/item');

// Item Routes
router.route('/api/items')
	.get(item.list)
	.post(item.create);

router.route('/api/items/:itemId')
	.get(item.read)
	.put(item.update)
	.delete(item.delete);

// Finish by binding the Item middleware
router.param('itemId', item.itemByID);

module.exports.basePath = '/';
module.exports.router = router;
