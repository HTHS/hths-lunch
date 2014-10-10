angular.module('hthsLunch.panel').controller('DashboardController', ['$scope',
	function($scope) {

	}
]).controller('DashboardItemsController', ['$scope', 'PanelItem',
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
]).controller('DashboardOrdersController', ['$scope', 'PanelOrder',
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
]).controller('DashboardScheduleController', ['$scope', 'PanelSchedule', function($scope, Schedule) {
	$scope.daysInMonth = function(month, year) {
		return new Date(year, month, 0).getDate();
	};

	$scope.today = {
		'date': new Date()
	};
	$scope.today.month = $scope.today.date.getMonth();
	$scope.today.year = $scope.today.date.getFullYear();
	$scope.today.daysInMonth = $scope.daysInMonth($scope.today.month, $scope.today.year);

	Schedule
		.query()
		.$promise.then(function(schedule) {
			var weeks = schedule.length / 4 + schedule.length % 4;
			var schoolDays = 5;
			$scope.schedule = [];
			for (var i = 0; i < weeks; i++) {
				$scope.schedule[i] = [];
				for (var z = 0; z < schoolDays; z++) {
					$scope.schedule[i][z] = new Date(schedule[i * (schoolDays - 1) + z]);
				}
			}

			/**
			 * var weeks = schedule.week.length / 6 + schedule.week.length % 6;
			var schoolDays = 7;
			$scope.schedule = [];
			for (var i = 0; i < weeks; i++) {
				$scope.schedule[i] = [];
				for (var z = 0; z < schoolDays; z++) {
					$scope.schedule[i][z] = new Date(schedule[i * (schoolDays - 1) + z]);
				}
			}
			 */
		});
}]);
