/**
 * Module dependencies
 */
var should = require('should'),
  mongoose = require('mongoose'),
  request = require('supertest')('http://localhost:3001'),
  Item = mongoose.model('Item'),
  item = require('../../app/controllers/item');

/**
 * Unit tests
 */
describe('Analytics controller unit tests:', function() {
  before(function(done) {
    done();
  });

  after(function(done) {
    done();
  });
});
