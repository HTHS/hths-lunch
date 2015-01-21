/**
 * Module dependencies
 */

var should = require('should'),
	mongoose = require('mongoose'),
	request = require('supertest'),
	Item = mongoose.model('Item'),
	item = require('../../app/controllers/item');

// app.route('/api/items')
// 	.post(item.create);
//
// app.route('/api/items/:itemId')
// 	.get(item.read)
// 	.put(item.update)
// 	.delete(item.delete);


var itemID;

/**
 * Unit tests
 */
describe('Item controller unit tests:', function() {
	before(function(done) {
		request = request('http://localhost:3001');

		var item = new Item({
			title: 'A delicious test item',
			description: 'A description',
			price: 4.5,
			active: true
		});

		itemID = item._id;

		item.save(done);
	});

	describe('GETting Item(s)', function() {
		it('should GET all Items', function(done) {
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

		it('should GET an Item', function(done) {
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

					done();
				});
		});
	});

	after(function(done) {
		Item.remove().exec();
		done();
	});
});
