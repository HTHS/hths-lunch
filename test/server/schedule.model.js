/**
 * Module dependencies
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Schedule = mongoose.model('Schedule');

var item1, item2, order1, order2;

/**
 * Unit tests
 */
describe('Schedule model unit tests:', function() {
	before(function(done) {
		done();
	});

	describe('Creating a Schedule', function() {
		it('should create and save a Schedule', function(done) {
			var schedule = new Schedule({
				schedules: [{
					"M": [
						1,
						2,
						3,
						4,
						5,
						6,
						9,
						10,
						11,
						12
					],
					"d": [
						2,
						3,
						4,
						5,
						6
					],
					"h": [
						9
					]
				}],
				startDate: new Date('9/4/2014'),
				endDate: new Date('6/18/2015')
			});

			schedule.save(done);
		});
	});

	after(function(done) {
		Schedule.remove().exec();
		done();
	});
});
