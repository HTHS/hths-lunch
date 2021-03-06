angular.module('hthsLunch.panel').factory(
  'PanelItem', ['$resource',
    function($resource) {
      return $resource('/api/panel/items/:itemId', {
        itemId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  ]).factory('PanelOrder', ['$resource',
  function($resource) {
    return $resource('/api/panel/orders/:orderId', {
      orderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]).factory('PanelSchedule', ['$resource',
  function($resource) {
    return $resource('/api/panel/schedule', {}, {
      create: {
        method: 'POST',
        isArray: true
      },
      update: {
        method: 'PUT'
      },
      getRaw: {
        url: '/api/panel/schedule/raw'
      }
    });
  }
]).factory('PanelAnalytics', ['$resource',
  function($resource) {
    return $resource('/api/panel/analytics', {
      // parameter aliases
    }, {
      getTopItems: {
        method: 'GET',
        isArray: true,
        url: '/api/panel/analytics/top-items'
      },
      getDays: {
        method: 'GET',
        isArray: true,
        url: '/api/panel/analytics/days',
        interceptor: {
          response: function(response) {
            return response.data.map(function(datum) {
              datum.date = new Date(datum.date);

              return datum;
            });
          },
          responseError: function(data) {

          }
        }
      }
    });
  }
]).factory('PanelUser', ['$resource',
  function($resource) {
    return $resource('/api/panel/users/:userId', {
      userId: '@_id'
    }, {
      invite: {
        method: 'POST'
      },
      inviteBulk: {
        method: 'POST',
        url: '/api/panel/users/bulk',
        headers: {
          'Content-Type': undefined // workaround to get multipart/form-data file uploads working, browser sets it
        },
        isArray: true
      },
      hasAuthorization: {
        url: '/api/panel/auth/:user',
        params: {
          user: '@user'
        },
        method: 'POST'
      }
    });
  }
]).filter('prettyprint', [function() {
  return function(order) {
    var prettyPrint = '';
    for (var i = 0; i < order.items.length; i++) {
      prettyPrint += order.items[i].title + ' x' + order.quantity[i];
      if (i + 1 < order.items.length) {
        // another item left to evaluate
        prettyPrint += ', ';
      }
    }

    return prettyPrint;
  };
}]);
