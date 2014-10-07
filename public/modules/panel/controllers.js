angular.module('hthsLunch.panel').controller('DashboardController', ['$scope',
	function($scope) {}
]).controller('DashboardItemsController', ['$scope', 'Item',
	function($scope, Item) {
		Item
			.query()
			.$promise.then(function(items) {
				$scope.items = items;
			});
	}
]);