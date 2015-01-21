/**
 * Module dependencies
 */
var should = require('should'),
  mongoose = require('mongoose'),
  Item = mongoose.model('Item'),
  Order = mongoose.model('Order'),
  Day = mongoose.model('Day');

var item1, item2, order1, order2;

/**
 * Unit tests
 */
describe('Day model unit tests:', function() {
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

    order1 = new Order({
      customer: 'Test customer',
      items: [
        item1._id,
        item2._id
      ],
      quantity: [
        2,
        1
      ],
      total: 14.25
    });

    order2 = new Order({
      customer: 'Test customer',
      items: [
        item1._id
      ],
      quantity: [
        1
      ],
      total: 4.5
    });

    done();
  });

  describe('Creating a Day', function() {
    it('should create and save a Day', function(done) {
      var day = new Day({
        date: new Date(),
        orders: [
          order1._id,
          order2._id
        ]
      });

      day.save(done);
    });
  });

  after(function(done) {
    Day.remove().exec();
    done();
  });
});
