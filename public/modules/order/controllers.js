angular.module('hthsLunch.order').controller('OrderController', ['$scope', '$state', 'Database', 'MessageService', 'Item', 'Order', 'User', 'Auth',
  function($scope, $state, Database, MessageService, Item, Order, User, Auth) {
    $scope.user = Database.getMe();

    if (!$scope.user) {
      $state.go('landingPage');
    } else {
      $scope.newOrder = {
        'total': 0,
        'items': {},
        'customer': $scope.user.displayName
      };

      Item
        .query()
        .$promise.then(function(items) {
          $scope.menu = items.map(function(item) {
            item.quantity = 0;
            return item;
          });

          if ($scope.user.orderHistory.length > 0) {
            var lastOrder = $scope.user.orderHistory[$scope.user.orderHistory.length - 1];
            if (lastOrder.toUpdate) {
              $scope.newOrder._id = lastOrder._id;
              $scope.newOrder.total = lastOrder.total;
              $scope.newOrder.toBeUpdated = true;
              for (var i = 0; i < lastOrder.items.length; i++) {
                for (var z = 0; z < $scope.menu.length; z++) {
                  if (lastOrder.items[i] === $scope.menu[z]._id) {
                    $scope.menu[z].quantity = lastOrder.quantity[i];
                    $scope.toggleItemInOrder(z);
                  }
                }
              }
            }
          }
        });
    }

    $scope.itemInOrder = function(index) {
      return $scope.newOrder.items[index] !== null;
    };

    $scope.toggleItemInOrder = function(index) {
      if ($scope.newOrder.items[index] !== null && typeof $scope.newOrder.items[
          index] === 'object') {
        delete $scope.newOrder.items[index];
        $scope.menu[index].quantity = 0;
      } else {
        $scope.newOrder.items[index] = $scope.menu[index];
        $scope.menu[index].quantity = 1;
      }
      $scope.recalculateTotal();
    };

    $scope.recalculateTotal = function() {
      $scope.newOrder.total = 0;
      for (var item in $scope.newOrder.items) {
        if ($scope.newOrder.items.hasOwnProperty(item) && $scope.newOrder.items[item]) {
          $scope.newOrder.total += $scope.newOrder.items[item].price * $scope.newOrder
            .items[item].quantity;
        }
      }
    };

    $scope.submitOrder = function() {
      if ($scope.newOrder.customer && $scope.newOrder.total > 0) {
        $scope.newOrder.items = $scope.menu.slice(0); // easy way to clone an Array by value
        $scope.newOrder.items = $scope.newOrder.items.filter(function(item) {
          return item.quantity > 0;
        });

        $scope.newOrder.quantity = [];

        $scope.newOrder.items = $scope.newOrder.items.map(function(item) {
          $scope.newOrder.quantity.push(item.quantity);
          return item._id;
        });

        if ($scope.newOrder.toBeUpdated) {
          Order
            .update($scope.newOrder)
            .$promise.then(function(order) {
              MessageService.showSuccessNotification('Order updated!');

              User
                .update($scope.user)
                .$promise.then(function(user) {
                  debugger;
                });
            });
        } else {
          Order
            .save($scope.newOrder)
            .$promise.then(function(order) {
              MessageService.showSuccessNotification('Order placed!');

              $scope.user.orderHistory.push(order._id);
              User
                .update($scope.user)
                .$promise.then(function(user) {
                  debugger;
                });
            });
        }
      }
    };

    $scope.goToDashboard = function() {
      $state.go('dashboard');
    };

    $scope.signout = function() {
      Auth
        .signout()
        .$promise.then(function(status) {
          if (status.success) {
            $state.go('landingPage', null, {
              reload: true
            });
          }
        });
    };
  }
]);
