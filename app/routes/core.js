var router = require('express').Router(),
	core = require('../controllers/core');

router.route('/')
	.get(core.index);

module.exports.basePath = '/';
module.exports.router = router;
