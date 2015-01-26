angular.module('hthsLunch.core.databaseService', ['hthsLunch.core.itemService', 'hthsLunch.core.orderService',
    'hthsLunch.core.userService', 'hthsLunch.core.authService'
  ])
  .factory('Database', ['$q', 'Item', 'Order', 'User', 'Auth', function($q, Item, Order, User, Auth) {
    var service = {};

    var me;

    service.getMe = function() {
      return me;
    };

    service.fetchMe = function() {
      var query = User.me().$promise;

      query.then(function(user) {
        me = user;
      });

      return query;
    };

    service.fetchAll = function() {
      return $q.all([this.fetchMe()]);
    };

    return service;
  }]);
