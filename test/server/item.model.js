/**
 * Module dependencies
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Item = mongoose.model('Item');

/**
 * Unit tests
 */
describe('Item model unit tests:', function() {
	before(function(done) {
		done();
	});

	describe('Creating an Item', function() {
		it('should create and save an Item', function(done) {
			var item = new Item({
				title: 'A delicious test item',
				description: 'A description',
				price: 4.5,
				active: true
			});

			item.save(done);
		});

		it('fails to create an Item with missing field', function(done) {
			var item = new Item({
				description: 'A description',
				price: 4.5,
				active: true
			});

			item.save(function(err) {
				(err !== null).should.be.true;
				done();
			});
		});
	});

	after(function(done) {
		Item.remove().exec();
		done();
	});
});
