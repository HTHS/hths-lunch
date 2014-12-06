angular.module('hthsLunch.panel').controller('DashboardController', ['$scope', function($scope) {

}]).controller('DashboardItemsController', ['$scope', 'PanelItem',
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

		$scope.editItem = function(item) {
			$scope.itemToUpdate = item;
			$scope.updateStatus = null;
		};

		$scope.updateItem = function() {
			$scope.updateStatus = 'Updating';

			$scope.itemToUpdate
				.$update()
				.then(function(item) {
					$scope.updateStatus = 'Success';
				})
				.catch(function(response) {
					$scope.updateStatus = 'Error, please try again';
				});
		};

		$scope.cancelUpdateItem = function() {
			$scope.itemToUpdate = null;
			$scope.updateStatus = null;
		};

		$scope.deleteItem = function(item) {
			// item
			// .$delete()
			// debugger;
		};

		$scope.toggleActivity = function(item, index) {
			item.active = !item.active;
			item.index = index;
			item
				.$update()
				.catch(function(response) {
					// reset item status, maybe figure out how to
					// delay settings Item status until a response
					// is received from the server
					$scope.items[response.config.data.index].active = !response.data.active;
				});
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
	$scope.newSchedule = {};

	$scope.createSchedule = function() {
		$scope.newSchedule.endDate = new Date($scope.newSchedule.fakeEndDate);
		$scope.newSchedule.endDate.setDate($scope.newSchedule.endDate.getDate() + 1);
		$scope.newSchedule.time = $scope.newSchedule.submissionTime.getHours();
		$scope.newSchedule.exceptions = $scope.newSchedule.datesToSkip ? $scope.newSchedule.datesToSkip.split(', ') : [];
		Schedule
			.create($scope.newSchedule)
			.$promise.then(function(schedule) {
				$scope.schedule = schedule.map(function(day) {
					return new Date(day);
				});

				debugger;
			});
	};

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
			var startingDayOfWeek = new Date(schedule[0]).getDay();

			if (startingDayOfWeek > 1) {
				var args = [0, 0];
				for (var day = 0; day < startingDayOfWeek - 1; day++) {
					args.push('');
				}
				Array.prototype.splice.apply(schedule, args);
			}

			var weeks = schedule.length / 4 + schedule.length % 4;
			var schoolDays = 5;
			$scope.schedule = [];
			for (var i = 0; i < weeks; i++) {
				$scope.schedule[i] = [];
				for (var z = 0; z < schoolDays; z++) {
					$scope.schedule[i][z] = new Date(schedule[i * (schoolDays - 1) + z]);
				}
			}
			debugger;

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
}]).controller('DashboardAnalyticsController', ['$scope', function($scope) {

}]).controller('DashboardUsersController', ['$scope', 'PanelUser', function($scope, User) {
	$scope.inviteUser = function() {
		User
			.invite($scope.newUser)
			.$promise.then(function() {
				debugger;
			});
	};
}]);
