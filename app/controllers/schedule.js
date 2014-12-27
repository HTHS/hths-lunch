/**
 * Module dependencies.
 */
var _ = require('lodash'),
  later = require('later'),
  mongoose = require('mongoose'),
  stringify = require('csv-stringify'),
  Schedule = mongoose.model('Schedule'),
  Order = mongoose.model('Order'),
  Item = mongoose.model('Item'),
  Day = mongoose.model('Day'),
  errorHandler = require('./error');

// Use ET for calculating start end days of school year
later.date.localTime();

/**
 * Create a Schedule
 */
exports.create = function(req, res) {
  var startDate = new Date(req.body.startDate);
  var endDate = new Date(req.body.endDate);
  var time = req.body.time;
  var exceptions = req.body.exceptions;

  exports.schoolDays = later.parse.recur()
    .on(time).minute()
    .onWeekday()
    .on(1, 2, 3, 4, 5, 6, 9, 10, 11, 12).month();

  exceptions.forEach(function(exception, index) {
    exception = new Date(exception);

    if (index === 0) {
      exports.schoolDays.except()
        .on(exception.getMonth()).month()
        .on(exception.getDate()).dayOfMonth()
        .on(exception.getFullYear()).year();
    } else {
      exports.schoolDays.and()
        .on(exception.getMonth()).month()
        .on(exception.getDate()).dayOfMonth()
        .on(exception.getFullYear()).year();
    }
  });

  exports.schoolDays.startDate = startDate;
  exports.schoolDays.endDate = endDate;

  var schedule = new Schedule(exports.schoolDays);

  schedule.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      exports.schoolSchedule = later.schedule(exports.schoolDays)
        .next(500, startDate, endDate);

      exports.job = later.setInterval(endSubmissionsForDay, exports.schoolDays);

      res.json(exports.schoolSchedule);
    }
  });
};

/**
 * Show the current Schedule
 */
exports.read = function(req, res) {
  res.json(exports.schoolSchedule);
};

/**
 * Update a Schedule
 */
exports.update = function(req, res) {
  exports.schoolDays = _.union(exports.schoolDays, req.body.exceptions);

  if (req.body.time) {
    exports.schoolDays.schedules[0].h[0] = req.body.time;
  }

  Schedule.findOneAndUpdate().exec(function(err, schedule) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      exports.schoolSchedule = later.schedule(exports.schoolDays)
        .next(500, exports.schoolDays.startDate, exports.schoolDays.endDate);

      exports.job.clear();
      exports.job = later.setInterval(endSubmissionsForDay, exports.schoolDays);

      res.json(exports.schoolSchedule);
    }
  });

};

function endSubmissionsForDay() {
  var now = new Date();
  var yesterdayCutoff = new Date(Date.now() - later.DAY);
  yesterdayCutoff.setMinutes(1);

  Order
    .find({})
    .where('timestamp')
    .lt(now)
    .gt(yesterdayCutoff)
    .sort('timestamp')
    .exec(function(err, orders) {
      if (err) {
        throw new Error(err);
      }

      orders.forEach(function(order) {
        order.items.forEach(function(item) {
          item.numberOrdered++;

          item
            .update({
              $inc: {
                numberOrdered: 1
              }
            }, {
              w: 1
            })
            .exec(function(err, numberAffected, rawResponse) {
              console.log(err);
              console.log(numberAffected);
              console.log(rawResponse);
            });
        });
      });

      var orderIDs = orders.map(function(order) {
        return order._id;
      });

      var today = new Day({
        orders: orderIDs
      });

      today.save(function(err) {
        if (err) {
          throw new Error(err);
        } else {
          generateCSV(today);
        }
      });
    });
}

function generateCSV(day) {
  Item
    .find({})
    .exec(function(err, items) {
      if (err) {
        throw new Error(err);
      }
      if (!items.length) {
        throw new Error('Please add all the items on the menu.');
      } else {
        stringify(items, function(err, output) {
          if (err) {
            throw new Error(err);
          } else {
            console.log(output);
          }
        });
      }
    });
}
