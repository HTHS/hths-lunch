/**
 * Module dependencies
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Promise = require('bluebird'),
	csv = require('../../app/controllers/csv');

/**
 * Unit tests
 */
describe('CSV helper logic unit tests:', function() {
	before(function(done) {
		done();
	});

	describe('Generate CSV string from array', function() {
		it('Returns a promise', function(done) {
			var promise = csv.generate([]);
			(promise instanceof Promise).should.be.true;

			done();
		});

		it('Processes an array into a CSV string', function(done) {
			csv
				.generate([
					['1', '2', '3', '4'],
					['a', 'b', 'c', 'd']
				])
				.then(function(csv) {
					csv.should.equal('1,2,3,4\na,b,c,d\n');

					done();
				})
				.catch(function(err) {
					done(err);
				});
		});
	});

	describe('Generate array from CSV string', function() {
		it('Returns a promise', function(done) {
			var promise = csv.parse('');
			(promise instanceof Promise).should.be.true;

			done();
		});

		it('Processes a CSV string into an array', function(done) {
			csv
				.parse('"First","Second","Third","Fourth"\n"a","b","c","d"\n"e","f","g","h"')
				.then(function(csv) {
					csv.should.eql([{
						First: 'a',
						Second: 'b',
						Third: 'c',
						Fourth: 'd'
					}, {
						First: 'e',
						Second: 'f',
						Third: 'g',
						Fourth: 'h'
					}]);

					done();
				})
				.catch(function(err) {
					done(err);
				});
		});
	});

	after(function(done) {
		done();
	});
});
