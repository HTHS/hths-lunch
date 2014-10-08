angular.module('hthsLunch.panel').controller('DashboardController', ['$scope',
	function($scope) {

	}
]).controller('DashboardItemsController', ['$scope', 'Item',
	function($scope, Item) {
		$scope.createItem = function() {
			Item
				.save({
					title: $scope.newItem.title,
					description: $scope.newItem.description,
					price: $scope.newItem.price
				})
				.$promise.then(function(item) {
					$scope.items.push(item);
				});
		};

		$scope.toggleActivity = function(item) {
			Item
				.update(angular.extend(item, {
					'active': !item.active
				}));
		};

		Item
			.query()
			.$promise.then(function(items) {
				$scope.items = items;
			});
	}
]).controller('DashboardOrdersController', ['$scope', 'Order',
	function($scope, Order) {
		$scope.deleteOrder = function(index) {
			$scope.orders[index]
				.$delete()
				.then(function(order) {
					$scope.orders.splice($scope.orders[index], 1);
				});
		};

		Order
			.query()
			.$promise.then(function(orders) {
				$scope.orders = orders;
			});
	}
]);
