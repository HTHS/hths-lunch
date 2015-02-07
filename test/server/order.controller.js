/**
 * Module dependencies
 */
var should = require('should'),
  mongoose = require('mongoose'),
  request = require('supertest')
  agent = request.agent('http://localhost:3001'),
  Order = mongoose.model('Order'),
  Item = mongoose.model('Item'),
  order = require('../../app/controllers/order'),
  router = require('express').Router(),
  mock_strat = require('./mock-strategy');

var itemID,
  order;

/**
 * Unit tests
 */
describe('Order controller unit tests:', function() {
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

  beforeEach(function(done){
  	mock_strat(router, {callbackUrl: '/auth/mock'});
    agent.get('/auth/mock').end(done);
  });

  it('POSTs an Order (/api/orders)', function(done) {
   	agent
   		.post('/api/orders')
      .send({
        "total": 9,
        "items": [itemID.toString()],
        "customer": "Ilan Biala",
        "quantity": [2]
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
          return done(err);
        }

        var order = res.body;

        (order !== null).should.be.true;
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
        "total": 4.5,
        "items": [itemID.toString()],
        "customer": "Ilan Biala",
        "quantity": [1]
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

        (order !== null).should.be.true;
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

        (order !== null).should.be.true;
        order.total.should.equal(4.5);
        order.quantity[0].should.equal(1);
        order.items.length.should.equal(order.quantity.length);
        order.total.should.equal(order.items[0].price * order.quantity[0]);

        done();
      });
  });

  after(function(done) {
    Item.remove().exec();
    Order.remove().exec();
    done();
  });
});
