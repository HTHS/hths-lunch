angular.module('hthsLunch.panel').controller('DashboardController', ['$scope', 'PanelAnalytics', function($scope, PanelAnalytics) {
	$scope.menuItems = [{
		iconClass: 'icon-settings',
		state: 'dashboard',
		text: 'Dashboard'
	}, {
		iconClass: 'icon-tags',
		state: 'dashboard.items',
		text: 'Items'
	}, {
		iconClass: 'icon-cart',
		state: 'dashboard.orders',
		text: 'Orders'
	}, {
		iconClass: 'icon-schedule',
		state: 'dashboard.schedule',
		text: 'Schedule'
	}, {
		iconClass: 'icon-analytics',
		state: 'dashboard.analytics',
		text: 'Analytics'
	}, {
		iconClass: 'icon-stats',
		state: 'dashboard.users',
		text: 'Users'
	}];

	PanelAnalytics
	.getTopItems()
	.$promise.then(function(topItems) {
		$scope.topItems = topItems;
	});
}]).controller('DashboardItemsController', ['$scope', '$mdDialog', '$mdToast', 'PanelItem', function($scope, $mdDialog, $mdToast, Item) {
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

	$scope.editItem = function(item, index, $event) {
		$scope.editingItem = new Item(item);
		$scope.editingItem.index = index;

		$mdDialog.show({
				controller: 'EditItemController',
				templateUrl: '/modules/panel/partials/edit-item.html',
				targetEvent: $event,
				locals: {
					editingItem: $scope.editingItem
				}
			})
			.then(function(item) {
				index = item.index;

				item
					.$update()
					.then(function(item) {
						var successToast = $mdToast
						.simple()
						.content(item.title + ' successfully updated')
						.position('top right');

						$mdToast.show(successToast);

						$scope.items[index] = item;
					})
					.catch(function(response) {
						var failureToast = $mdToast
						.simple()
						.content(item.title + ' not updated')
						.position('top right');

						$mdToast.show(failureToast);
					});
			});
	};

	$scope.toggleActivity = function(item, index) {
		item.index = index;
		item
			.$update()
			.then(function(item) {
				var successToast = $mdToast
					.simple()
					.content(item.title + ' successfully updated')
					.position('top right');

				$mdToast.show(successToast);
			})
			.catch(function(response) {
				var failureToast = $mdToast
					.simple()
					.content(item.title + ' not updated')
					.position('top right');

				$mdToast.show(failureToast);

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
		})
		.catch(function(reponse) {
			debugger;
		});
}]).controller('DashboardOrdersController', ['$scope', 'PanelOrder',
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
	User
	.query()
	.$promise
	.then(function(users) {
		$scope.users = users;
	});

	$scope.inviteUser = function() {
		User
			.invite($scope.newUser)
			.$promise.then(function() {
				debugger;
			});
	};
}]).controller('EditItemController', ['$scope', '$mdDialog', 'editingItem', function($scope, $mdDialog, editingItem) {
	$scope.editingItem = editingItem;

	$scope.update = function() {
		$mdDialog.hide(editingItem);
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
}]);
