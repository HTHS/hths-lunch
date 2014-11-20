/**
 * Module dependencies
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Item = mongoose.model('Item'),
	Order = mongoose.model('Order');

var item1, item2;

/**
 * Unit tests
 */
describe('Order model unit tests:', function() {
	before(function(done) {
		item1 = new Item({
			title: 'A delicious test item',
			description: 'An item description',
			price: 4.5,
			active: true
		});

		item2 = new Item({
			title: 'Another delicious test item',
			description: 'Another item description',
			price: 5.25,
			active: true
		});

		done();
	});

	describe('Creating an Order', function() {
		it('should create and save an order', function(done) {
			var order = new Order({
				customer: 'Test customer',
				items: [
					item1._id,
					item2._id
				],
				quantity: [
					2,
					1
				],
				total: 14.25,
				timestamp: new Date()
			});

			order.save(done);
		});

		it('fails to create an Order with missing field', function(done) {
			var order = new Order({
				customer: 'Test customer',
				items: [
					item1._id,
					item2._id
				],
				quantity: [
					2,
					1
				],
				// total: 14.25, missing field
				timestamp: new Date()
			});

			order.save(function(err) {
				(err !== null).should.be.true;
				done();
			});

		});
	});

	after(function(done) {
		Order.remove().exec();
		done();
	});
});
