// router.all('*', panel.requiresLogin, panel.requiresAuthentication);
//
// // Item Routes
// router.route('/items')
// .get(panel.getItems)
// .post(panel.createItem);
//
// router.route('/items/:itemId')
// .get(panel.getItem)
// .put(panel.updateItem)
// .delete(panel.deleteItem);
//
// // Lunch order routes
// router.route('/orders')
// .get(panel.getOrders);
//
// router.route('/orders/:orderId')
// .get(panel.getOrder)
// .delete(panel.deleteOrder);
//
// // Schedule routes
// router.route('/schedule')
// .get(panel.getSchedule)
// .post(panel.createSchedule)
// .put(panel.updateSchedule);
//
// // Analytics routes
// router.route('/analytics')
// .get(panel.getTopItems);
//
// router.route('/analytics/top-items')
// .get(panel.getTopItems);
//
// router.route('/analytics/days')
// .get(panel.getDays);
//
// // Users routes
// router.route('/users')
// .get(panel.getUsers)
// .post(panel.inviteUser);
//
// router.route('/users/:userId')
// .delete(panel.deleteUser);
//
// router.route('/auth/:userId')
// .post(panel.userHasAuthorization);

/**
 * Module dependencies
 */
var should = require('should'),
	mongoose = require('mongoose'),
	request = require('supertest')('http://localhost:3001'),
	Order = mongoose.model('Order'),
	Item = mongoose.model('Item'),
	panel = require('../../app/controllers/panel');

var item,
	order;

// TODO finish tests

/**
 * Unit tests
 */
describe('Panel controller unit tests:', function() {
	before(function(done) {

		item = new Item({
			title: 'A delicious test item',
			description: 'A description',
			price: 4.5,
			active: true
		});

		item.save(function(err) {
			if (err) {
				return done(err);
			}

			order = new Order({
				"total": 4.5,
				"items": [item._id],
				"customer": "Ilan Biala",
				"quantity": [1]
			});

			order.save(done);
		});
	});

	it('Returns 401 when not logged in (/api/panel/items)', function(done) {
		request.get('/api/panel/items')
			.expect(401, done);
	});

	// it('GETs all Items (/api/panel/items)', function(done) {
	// 	request
	// 		.get('/api/panel/items')
	// 		.expect('Content-Type', /json/)
	// 		.expect(200)
	// 		.end(function(err, res) {
	// 			if (err) {
	// 				return done(err);
	// 			}
	//
	// 			var items = res.body;
	//
	// 			Array.isArray(items).should.be.true;
	// 			items.length.should.equal(1);
	// 			items[0].price.should.equal(4.5);
	// 			items[0].active.should.be.true;
	//
	// 			done();
	// 		});
	// });

	after(function(done) {
		Order.remove().exec();
		Item.remove().exec();

		done();
	});
});
