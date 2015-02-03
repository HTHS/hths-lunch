/**
 * Module dependencies.
 */
var _ = require('lodash'),
  later = require('later'),
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  Schedule = mongoose.model('Schedule'),
  Order = mongoose.model('Order'),
  Item = mongoose.model('Item'),
  Day = mongoose.model('Day'),
  csv = require('./csv'),
  Email = require('./email'),
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
    .on(time).hour()
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

  Schedule.findOneAndUpdate({}).exec(function(err, schedule) {
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

exports.init = function scheduleOrderProcessing() {
  var p = Promise.defer();

  Schedule.findOne().exec(function(err, schedule) {
    if (!err && schedule) {
      var startDate = new Date(schedule.startDate);
      var endDate = new Date(schedule.endDate);
      var time = schedule.schedules[0].h[0];
      var exceptions = schedule.exceptions;

      exports.schoolDays = later.parse.recur()
        .on(time).hour()
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
      exports.schoolSchedule = later.schedule(exports.schoolDays).next(
        500,
        exports.schoolDays.startDate, exports.schoolDays.endDate);
      exports.job = later.setInterval(endSubmissionsForDay, exports.schoolDays);
    }

    p.resolve();
  });

  return p.promise;
};

exports.isBetween = function(date) {
  if (!exports.schoolDays) {
    return false;
  }

  var now = new Date();
  var prev1 = later.schedule(exports.schoolDays).prev(1, now);
  var next1 = later.schedule(exports.schoolDays).next(1, now);

  if (next1 - date < next1 - prev1) {
    return true;
  } else {
    return false;
  }
};

function endSubmissionsForDay() {
  var now = new Date();
  var yesterdayCutoff = later.schedule(exports.schoolDays).prev(2, now)[1];
  yesterdayCutoff.setSeconds(1);

  console.log('Ending submissions for this period from %s to %s',
    yesterdayCutoff.toUTCString(),
    now.toUTCString());

  Order
    .find({})
    .where('created').gte(yesterdayCutoff).lte(now)
    .sort('created')
    .populate('items')
    .exec(function(err, orders) {
      if (err) {
        throw new Error(err);
      }

      var today;

      if (orders.length) {
        orders.forEach(function(order) {
          console.log('Order: ', order);

          order.items.forEach(function(item) {
            item
              .update({
                $inc: {
                  numberOrderd: 1
                }
              }, {}, function(err, numberUpdated, result) {
                if (err) {
                  console.error('Error: Tried to increment numberOrdered on item: ', item);
                  console.error(err);
                } else {
                  console.log('Updated item ', result);
                }
              });
          });
        });

        var orderIDs = orders.map(function(order) {
          return order._id;
        });

        today = new Day({
          orders: orderIDs
        });
      } else {
        today = new Day({
          orders: []
        });
      }

      today.save(function(err) {
        if (err) {
          throw new Error(err);
        } else {
          var data = {
            items: [],
            quantity: [],
            total: 0
          };

          var csvData = [
            ['Items', 'Quantity', 'Total']
          ];

          orders.forEach(function(order) {
            order.items.forEach(function(item) {
              var itemIndexInItems = data.items.indexOf(item.title);
              if (itemIndexInItems !== -1) {
                data.quantity[itemIndexInItems] ++;
              } else {
                data.items.push(item.title);
                data.quantity.push(1);
              }
            });
          });

          for (var i = 0; i < data.items.length; i++) {
            var itemTotal = data.items[i].price * data.quantity[i];
            csvData.push([data.items[i], data.quantity[i], '$' + itemTotal]);
            data.total += itemTotal;
          }

          csvData.push([]);
          csvData.push(['Grand total:', '', '$' + data.total]);

          console.log('Generating CSVs now from today: ', today);
          csv
            .generate(csvData)
            .then(function(csv) {
              emailCSV(csv);
            })
            .catch(function(err) {
              console.error('There was an error creating the CSV.');
              console.error('Error: ', err);
            });
        }
      });
    });
}

function emailCSV(csv) {
  var today = new Date();

  console.log('Today\'s CSV: ', csv);

  var options = {
    to: 'ibiala@ctemc.org',
    subject: 'HTHS-Lunch CSV',
    text: 'Attached is the CSV.',
    html: 'Attached is the CSV.',
    attachments: [{
      filename: 'HTHS-' + today.getDate() + '-' + (today.getMonth() + 1) +
        '-' + today.getFullYear() + '.csv',
      content: csv
    }]
  };

  var orderEmail = new Email(options);

  orderEmail
    .send()
    .then(function(info) {
      console.log('Sent order CSV for ', today.toDateString());
      console.log(info);
    })
    .catch(function(err) {
      console.error(err);
    });
}
