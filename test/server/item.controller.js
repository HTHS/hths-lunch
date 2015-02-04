/**
 * Module dependencies
 */
var should = require('should'),
	mongoose = require('mongoose'),
	request = require('supertest')('http://localhost:3001'),
	Item = mongoose.model('Item'),
	item = require('../../app/controllers/item');

var itemID;

/**
 * Unit tests
 */
describe('Item controller unit tests:', function() {
	before(function(done) {
		var item = new Item({
			title: 'A delicious test item',
			description: 'A description',
			price: 4.5,
			active: true
		});

		itemID = item._id;

		item.save(done);
	});

	describe('GET Item(s)', function() {
		it('GET all Items (/api/items)', function(done) {
			request
				.get('/api/items')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					var items = res.body;

					Array.isArray(items).should.be.true;
					items.length.should.equal(1);

					done();
				});
		});

		it('GET an Item by ID (/api/items/:id)', function(done) {
			request
				.get('/api/items/' + itemID)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						return done(err);
					}

					var item = res.body;

					(item !== null).should.be.true;
					item._id.should.equal(itemID.toString());

					done();
				});
		});
	});

	after(function(done) {
		Item.remove().exec();
		done();
	});
});
