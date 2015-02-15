angular.module('hthsLunch.core.databaseService', ['hthsLunch.core.itemService', 'hthsLunch.core.orderService',
    'hthsLunch.core.userService', 'hthsLunch.core.authService'
  ])
  .factory('Database', ['$q', 'Item', 'Order', 'User', 'Auth', function($q, Item, Order, User, Auth) {
    var service = {};

    var me;
    var items;

    service.getMe = function() {
      return me;
    };

    service.fetchMe = function() {
      var promise = User.me().$promise;

      promise
        .then(function(user) {
          me = user;
        })
        .catch(function(response) {
          if (response.status === 401) {
            me = null;
          }
        });

      return promise;
    };

    service.updateMe = function(user) {
      var promise = User.update(user).$promise;

      promise.then(function(newMe) {
        me = newMe;
      });

      return promise;
    };

    service.saveOrder = function(order) {
      return Order
        .save(order)
        .$promise.then(function(order) {
          me.orderHistory.push(order._id);
          return service.updateMe(me);
        });
    };

    service.updateOrder = function(order) {
      var promise = Order.update(order).$promise;

      return promise;
    };
    
    service.fetchAll = function () {
      return $q.all({
        me: this.fetchMe()
      });
    };

    return service;
  }]);
