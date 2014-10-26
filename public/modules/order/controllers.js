angular.module('hthsLunch.order').controller('OrderController', ['$scope', '$state',
	'Item', 'Order', 'User', 'Auth',
	function($scope, $state, Item, Order, User, Auth) {
		$scope.user = user;

		if (!$scope.user) {
			$state.go('landingPage');
		} else {
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
				if (todaysDateTime - lastOrderDateTime > 0 && todaysDate.getHours() < 9 || todaysDateTime - lastOrderDateTime <
					tomorrowsDate.getTime() - todaysDateTime > 0) {
					debugger;
				}
			}

			$scope.newOrder = {
				'total': 0,
				'items': {},
				'customer': $scope.user.displayName
			};
		}

		Item.query().$promise.then(function(items) {
			$scope.menu = items.map(function(item) {
				item.quantity = 0;
				return item;
			});
		});

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
				if ($scope.newOrder.items.hasOwnProperty(item)) {
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

				Order
					.save($scope.newOrder)
					.$promise.then(function(order) {
						$scope.orderProcessed = true;

						$scope.user.orderHistory.push(order._id);
						$scope.user.currentOrder = order;
						User
							.update($scope.user)
							.$promise.then(function(user) {
								debugger;
							});
					});
			}
		};

		$scope.signout = function() {
			Auth
				.signout()
				.$promise.then(function(status) {
					if (status.success) {
						setTimeout(function() {
							$state.go('landingPage');
						}, 2000);
					}
				});
		};
	}
]);
