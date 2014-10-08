angular.module('hthsLunch.order').controller('OrderController', ['$scope',
	'Item', 'Order',
	function($scope, Item, Order) {
		$scope.newOrder = {
			'total': 0,
			'items': [],
			'customer': ''
		};
		Item.query().$promise.then(function(items) {
			$scope.menu = items.map(function(item) {
				item.quantity = 0;
				return item;
			});
		});

		$scope.toggleItemInOrder = function(index) {
			if ($scope.newOrder[index]) {
				delete $scope.newOrder.items[index];
			} else {
				debugger;
				$scope.newOrder.items[index] = $scope.menu[index];
			}
		};

		$scope.submitOrder = function() {

		};
	}
]);
