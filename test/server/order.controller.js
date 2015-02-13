/**
 * Module dependencies
 */
var should = require('should'),
  mongoose = require('mongoose'),
  request = require('supertest')('http://localhost:3001'),
  passport = require('passport'),
  Order = mongoose.model('Order'),
  User = mongoose.model('User'),
  Item = mongoose.model('Item'),
  order = require('../../app/controllers/order');

var agent = require('supertest').agent('http://localhost:3001');

var itemID,
  user,
  order;

/**
 * Unit tests
 */
describe('Order controller unit tests:', function() {
  before(function(done) {
    var item = new Item({
      title: 'User controller test item',
      description: 'A description',
      price: 4.5,
      active: true
    });

    itemID = item._id;

    item.save(done);
  });

  before(function(done) {
    this.timeout(3000);

    agent
      .post('/auth/mock')
      .send({
    		firstName: 'Test',
    		lastName: 'User',
    		displayName: 'Test User',
    		email: 'testuser@gmail.com',
    		provider: 'local',
    		password: 'testuser',
    		isAdmin: true
    	})
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        res.body.should.have.property('success', true);

        user = res.body.user;

        done();
      });
  });

  it('POSTs an Order (/api/orders)', function(done) {
    agent
      .post('/api/orders')
      .send({
        total: 9,
        items: [itemID.toString()],
        customer: 'Ilan Biala',
        quantity: [2],
        user: user._id
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        order = res.body;

        order.total.should.equal(9);
        order.quantity[0].should.equal(2);
        order.items[0].should.equal(itemID.toString());

        done();
      });
  });

  it('GETs an Order by ID (/api/orders/:id)', function(done) {
    agent
      .get('/api/orders/' + order._id.toString())
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          console.log(res.body);

          return done(err);
        }

        var order = res.body;

        (order !== null).should.equal(true);
        order.total.should.equal(9);
        order.quantity[0].should.equal(2);
        order.items.length.should.equal(order.quantity.length);
        order.total.should.equal(order.items[0].price * order.quantity[0]);

        done();
      });
  });

  it('PUTs an Order (/api/orders/:id)', function(done) {
    agent
      .put('/api/orders/' + order._id.toString())
      .send({
        total: 4.5,
        items: [itemID.toString()],
        customer: 'Ilan Biala',
        quantity: [1]
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        order = res.body;

        order.total.should.equal(4.5);
        order.quantity[0].should.equal(1);
        order.items[0].should.equal(itemID.toString());

        done();
      });
  });

  it('GETs an updated Order by ID (/api/orders/:id)', function(done) {
    agent
      .get('/api/orders/' + order._id.toString())
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var order = res.body;

        (order !== null).should.equal(true);
        order.total.should.equal(4.5);
        order.quantity[0].should.equal(1);
        order.items.length.should.equal(order.quantity.length);
        order.total.should.equal(order.items[0].price * order.quantity[0]);

        done();
      });
  });

  it('DELETEs an Order by ID (/api/orders/:id)', function(done) {
    agent
      .delete('/api/orders/' + order._id.toString())
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        var order = res.body;

        (order !== null).should.equal(true);
        order.total.should.equal(4.5);
        order.quantity[0].should.equal(1);
        order.items.length.should.equal(order.quantity.length);
        order.total.should.equal(order.items[0].price * order.quantity[0]);

        done();
      });
  });

  after(function(done) {
    User.remove().exec();
    Item.remove().exec();
    Order.remove().exec();
    done();
  });
});
