angular.module('hthsLunch.order').controller('OrderController', ['$scope',
	'Item', 'Order',
	function($scope, Item, Order) {
		$scope.newOrder = {
			'total': 0,
			'items': {},
			'customer': ''
		};
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
				Order
					.save($scope.newOrder)
					.$promise.then(function(order) {
						$scope.orderProcessed = true;
					});
			}
		};
	}
]);
