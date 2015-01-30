angular.module('hthsLunch.order').controller('OrderController', ['$scope', '$state', 'Database', 'MessageService', 'Item', 'Order', 'User', 'Auth',
	function($scope, $state, Database, MessageService, Item, Order, User, Auth) {
		$scope.user = Database.getMe();
		var BLANK_ORDER = {
			total: 0,
			items: {},
			customer: $scope.user.displayName
		};

		if (!$scope.user) {
			$state.go('landingPage');
		} else {
			$scope.newOrder = BLANK_ORDER;

			Item
				.query()
				.$promise.then(function(items) {
					$scope.menu = items.map(function(item) {
						// item.quantity = 0; // setting this will cause ng-model to show quantity 0 in form
						return item;
					});

					if ($scope.user.orderHistory.length > 0) {
						var lastOrder = $scope.user.orderHistory[$scope.user.orderHistory.length - 1];
						populateForm(lastOrder);
					}
				});
		}

		function populateForm(order) {
			for (var i = 0; i < order.items.length; i++) {
				for (var z = 0; z < $scope.menu.length; z++) {
					if (order.items[i] === $scope.menu[z]._id) {
						$scope.menu[z].quantity = order.quantity[i];
						$scope.toggleItemInOrder(z);
					}
				}
			}

			if (order.toUpdate) {
				$scope.newOrder._id = order._id;
				$scope.newOrder.total = order.total;
				$scope.newOrder.toBeUpdated = true;
			}
		}

		$scope.itemInOrder = function(index) {
			return $scope.newOrder.items[index] !== null;
		};

		$scope.toggleItemInOrder = function(index) {
			if ($scope.newOrder.items[index] !== null && typeof $scope.newOrder.items[
					index] === 'object') {
				delete $scope.newOrder.items[index];
				$scope.menu[index].quantity = null;
			} else {
				$scope.newOrder.items[index] = $scope.menu[index];
				$scope.menu[index].quantity = 1;
			}
			$scope.recalculateTotal();
		};

		$scope.checkIfBlank = function(index) {
			if ($scope.menu[index].quantity === undefined) {
				$scope.menu[index].quantity = null;
			}
		}

		$scope.recalculateTotal = function() {
			$scope.newOrder.total = 0;
			for (var item in $scope.newOrder.items) {
				if ($scope.newOrder.items.hasOwnProperty(item) && $scope.newOrder.items[item] && $scope.newOrder.items[item].quantity) {
					$scope.newOrder.total += $scope.newOrder.items[item].price * $scope.newOrder.items[item].quantity;
				}
			}
		};

		$scope.submitOrder = function() {
			if ($scope.newOrder.customer && $scope.newOrder.total > 0) {
				$scope.newOrder.quantity = [];
				$scope.newOrder.items = $scope.menu.slice(0); // easy way to clone an Array by value

				$scope.newOrder.items = $scope.newOrder.items.filter(function(item) {
					return item.quantity > 0;
				}).map(function(item) {
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
									$scope.newOrder.toBeUpdated = true;
									debugger;
								});
						});
				}
			}
		};

		$scope.deleteOrder = function(){
			Order
				.delete({'orderId': $scope.newOrder._id})
				.$promise.then(function(){
					MessageService.showSuccessNotification('Order deleted!');
					$scope.newOrder = BLANK_ORDER;
					$scope.newOrder.toBeUpdated = false;
					populateForm(BLANK_ORDER);
				});
		}

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
