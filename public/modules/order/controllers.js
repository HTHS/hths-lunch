angular.module('hthsLunch.order').controller('OrderController', ['$scope', '$state', 'Database', 'MessageService', 'Item', 'Order', 'User', 'Auth',
	function($scope, $state, Database, MessageService, Item, Order, User, Auth) {
		$scope.user = Database.getMe();
		var BLANK_ORDER;

		if (!$scope.user) {
			$state.go('landingPage');
		} else {
			BLANK_ORDER = {
				total: 0,
				items: {},
				customer: $scope.user.displayName,
				user: $scope.user._id
			};

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
						if (lastOrder.toUpdate) {
							populateForm(lastOrder);
						}
					}
				});
		}

		function clearForm() {
			for (var i = 0; i < $scope.menu.length; i++) {
				$scope.menu[i].checked = false;
				$scope.toggleItemInOrder(i);
			}
			$scope.orderForm.$setPristine();
		}

		function populateForm(order) {
			for (var i = 0; i < order.items.length; i++) {
				for (var z = 0; z < $scope.menu.length; z++) {
					if (order.items[i] === $scope.menu[z]._id) {
						$scope.menu[z].checked = order.quantity[i] > 0;
						$scope.toggleItemInOrder(z);
						$scope.menu[z].quantity = order.quantity[i];
					}
				}
			}

			$scope.menu = $scope.menu.map(function(i) {
				i.checked = i.checked || false;
				return i;
			});

			$scope.recalculateTotal();

			if (order.toUpdate) {
				$scope.newOrder._id = order._id;
				$scope.newOrder.total = order.total;
				$scope.newOrder.toBeUpdated = true;
			}
		}

		$scope.itemInOrder = function(index) {
			return $scope.newOrder.items[index] !== null;
		};

		$scope.canLoadOrder = function() {
			var numberOfOrders = $scope.user.orderHistory.length;
			if ($scope.newOrder.toBeUpdated) {
				// grab 2nd to last order
				return numberOfOrders - 2 >= 0 ? true : false;
			} else {
				// last order
				return numberOfOrders - 1 >= 0 ? true : false;
			}
		};

		$scope.toggleItemInOrder = function(index) {
			//if ($scope.newOrder.items[index] !== null && typeof $scope.newOrder.items[index] === 'object') {
			if (!$scope.menu[index].checked) {
				delete $scope.newOrder.items[index];
				$scope.menu[index].quantity = null;
			} else {
				$scope.newOrder.items[index] = $scope.menu[index];
				$scope.menu[index].quantity = 1;
			}
			$scope.recalculateTotal();
		};

		$scope.checkIfBlank = function(index) {
			if ($scope.menu[index].quantity === undefined || $scope.menu[index].quantity === 0) {
				$scope.menu[index].quantity = null;
				$scope.menu[index].checked = false;
				$scope.toggleItemInOrder(index);
			}
		};

		$scope.recalculateTotal = function() {
			$scope.newOrder.total = 0;
			for (var item in $scope.newOrder.items) {
				if ($scope.newOrder.items.hasOwnProperty(item) && $scope.newOrder.items[item] && $scope.newOrder.items[item].quantity) {
					$scope.newOrder.total += $scope.newOrder.items[item].price * $scope.newOrder.items[item].quantity;
				}
			}
		};

		$scope.loadLastOrder = function() {
			var numberOfUserOrders = $scope.user.orderHistory.length;
			if ($scope.newOrder.toBeUpdated) {
				// grab 2nd to last order
				if (numberOfUserOrders - 2 >= 0) {
					clearForm();
					populateForm($scope.user.orderHistory[numberOfUserOrders - 2]);
				}
			} else {
				// last order
				if (numberOfUserOrders - 1 >= 0) {
					clearForm();
					populateForm($scope.user.orderHistory[numberOfUserOrders - 1]);
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
							populateForm($scope.newOrder);

							User
								.update($scope.user)
								.$promise.then(function(user) {
									debugger;
								});
						})
						.catch(function(response) {
							MessageService.showFailureNotification('Failed to update order');
						});
				} else {
					Order
						.save($scope.newOrder)
						.$promise.then(function(order) {
							MessageService.showSuccessNotification('Order placed!');
							populateForm($scope.newOrder);
							$scope.newOrder._id = order._id;
							$scope.newOrder.toBeUpdated = true;
							console.log($scope.newOrder._id);

							$scope.user.orderHistory.push(order._id);
							User
								.update($scope.user)
								.$promise.then(function(user) {
									debugger;
								});
						})
						.catch(function(response) {
							MessageService.showFailureNotification('Failed to place order');
						});
				}
			}
		};

		$scope.deleteOrder = function() {
			Order
				.delete({
					'orderId': $scope.newOrder._id
				})
				.$promise.then(function() {
					MessageService.showSuccessNotification('Order deleted!');
					$scope.newOrder = BLANK_ORDER;
					$scope.newOrder.toBeUpdated = false;
					clearForm();

					$scope.user.orderHistory.pop();
					User
						.update($scope.user)
						.$promise.then(function(user) {
							debugger;
						});
				});
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
