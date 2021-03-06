/**
 * Module dependencies
 */
var should = require('should'),
  mongoose = require('mongoose'),
  Item = mongoose.model('Item'),
  User = mongoose.model('User'),
  Order = mongoose.model('Order');

var item1, item2, user1;

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

    user1 = new User({
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User',
      email: 'testuser@gmail.com',
      provider: 'local'
    });

    done();
  });

  describe('Creating an Order', function() {
    it('should create and save an order', function(done) {
      var order = new Order({
        customer: 'Test customer',
        user: user1._id,
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

      order.save(done);
    });

    it('fails to create an Order with missing field', function(done) {
      var order = new Order({
        customer: 'Test customer',
        user: user1._id,
        items: [
          item1._id,
          item2._id
        ],
        quantity: [
          2,
          1
        ],
        // total: 14.25, missing field
      });

      order.save(function(err) {
        (err !== null).should.be.true;
        done();
      });

    });
  });

  after(function(done) {
    User.remove().exec();
    Order.remove().exec();
    Item.remove().exec();
    done();
  });
});
