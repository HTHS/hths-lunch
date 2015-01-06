angular.module('hthsLunch.order').controller('OrderController', ['$scope', '$state', 'MessageService', 'Item', 'Order', 'User', 'Auth',
	function($scope, $state, MessageService, Item, Order, User, Auth) {
		$scope.user = user;

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
					var lastOrderDate = new Date($scope.user.orderHistory[$scope.user.orderHistory.length - 1].timestamp);
					var todaysDate = new Date();
					var lastOrderDateTime = lastOrderDate.getTime();
					var todaysDateTime = todaysDate.getTime();
					var tomorrowsDate = new Date();
					tomorrowsDate.setDate(todaysDate.getDate() + 1);
					tomorrowsDate.setHours(9);
					tomorrowsDate.setMinutes(0);
					tomorrowsDate.setSeconds(0);
					// Let's update the order, not create a new one, because it's before the cutoff time
					// if order time is before now, and right now is before 9 AM or 9 AM tomorrow - right now < 9 AM tomorrow - order time
					if (todaysDateTime - lastOrderDateTime > 0 && todaysDate.getHours() < 9 || todaysDateTime - lastOrderDateTime <
						tomorrowsDate.getTime() - lastOrderDateTime) {
						var orderToUpdate = $scope.user.orderHistory[$scope.user.orderHistory.length - 1];
						$scope.newOrder._id = orderToUpdate._id;
						$scope.newOrder.total = orderToUpdate.total;
						$scope.newOrder.toBeUpdated = true;
						for (var i = 0; i < orderToUpdate.items.length; i++) {
							for (var z = 0; z < $scope.menu.length; z++) {
								if (orderToUpdate.items[i] === $scope.menu[z]._id) {
									$scope.menu[z].quantity = orderToUpdate.quantity[i];
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
				$scope.recalculateTotal();
			} else {
				$scope.newOrder.items[index] = $scope.menu[index];
			}
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
