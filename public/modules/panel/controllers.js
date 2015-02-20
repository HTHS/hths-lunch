angular.module('hthsLunch.panel').controller('DashboardController', ['$scope', '$filter', 'PanelAnalytics', function($scope, $filter, PanelAnalytics) {
	$scope.menuItems = [{
		iconClass: 'icon-dashboard',
		state: 'dashboard',
		text: 'Dashboard'
	}, {
		iconClass: 'icon-items',
		state: 'dashboard.items',
		text: 'Items'
	}, {
		iconClass: 'icon-orders',
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
		iconClass: 'icon-users',
		state: 'dashboard.users',
		text: 'Users'
	}];

	PanelAnalytics
		.getTopItems()
		.$promise.then(function(topItems) {
			$scope.topItemsData = {
				data: [],
				labels: []
			};

			topItems.forEach(function(topItem) {
				$scope.topItemsData.data.push(topItem.numberOrdered);
				$scope.topItemsData.labels.push(topItem.title);
			});
		});

	PanelAnalytics
		.getDays()
		.$promise.then(function(days) {
			$scope.ordersPerDayData = {
				data: [],
				labels: []
			};

			days.forEach(function(day) {
				$scope.ordersPerDayData.data.push(day.orders.length);
				$scope.ordersPerDayData.labels.push($filter('date')(day.date, 'mediumDate'));
			});
		});
}]).controller('DashboardItemsController', ['$scope', '$mdDialog', 'MessageService', 'PanelItem', function($scope, $mdDialog, MessageService, Item) {
	$scope.categories = [
		'Hot',
		'Sandwiches',
		'Salads',
		'Snacks'
	];

	$scope.newItem = {
		active: true
	};

	$scope.createItem = function() {
		Item
			.save($scope.newItem)
			.$promise.then(function(item) {
				$scope.items.push(item);
				$scope.newItem = {
					active: true
				};
				$scope.createItemForm.$setPristine();
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
						MessageService.showSuccessNotification(item.title + ' successfully updated');

						$scope.items[index] = item;
					})
					.catch(function(response) {
						MessageService.showFailureNotification(item.title + ' not updated');
					});
			});
	};

	$scope.toggleActivity = function(item, index) {
		item.index = index;
		item
			.$update()
			.then(function(item) {
				MessageService.showSuccessNotification(item.title + ' successfully updated');
			})
			.catch(function(response) {
				MessageService.showFailureNotification(item.title + ' not updated');

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
		.catch(function(response) {
			debugger;
		});
}]).controller('DashboardOrdersController', ['$scope', 'MessageService', 'PanelOrder',
	function($scope, MessageService, Order) {
		$scope.deleteOrder = function(index) {
			$scope.orders[index]
				.$delete()
				.then(function(order) {
					$scope.orders.splice($scope.orders[index], 1);
					MessageService.showSuccessNotification('Successfully deleted order');
				})
				.catch(function(response) {
					MessageService.showFailureNotification('Failed to delete order');
				});
		};

		Order
			.query()
			.$promise.then(function(orders) {
				$scope.orders = orders;
			});
	}
]).controller('DashboardScheduleController', ['$scope', 'MessageService', 'PanelSchedule', function($scope, MessageService, Schedule) {
	$scope.newSchedule = {};
	$scope.today = {
		'date': new Date()
	};
	$scope.today.month = $scope.today.date.getMonth();
	$scope.today.year = $scope.today.date.getFullYear();
	$scope.today.daysInMonth = daysInMonth($scope.today.month, $scope.today.year);
	$scope.schedule = [];

	function daysInMonth(month, year) {
		return new Date(year, month, 0).getDate();
	};

	$scope.createSchedule = function() {
		$scope.newSchedule.endDate = new Date($scope.newSchedule.fakeEndDate);
		$scope.newSchedule.endDate.setDate($scope.newSchedule.endDate.getDate() + 1);
		$scope.newSchedule.time = $scope.newSchedule.submissionTime.getHours();
		$scope.newSchedule.exceptions = $scope.newSchedule.datesToSkip ? $scope.newSchedule.datesToSkip.split(', ') : [];
		Schedule
			.create($scope.newSchedule)
			.$promise.then(function(schedule) {
				MessageService.showSuccessNotification('Schedule created!');

				$scope.schedule = schedule.map(function(day) {
					return new Date(day);
				});

				debugger;
			});
	};

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

			var endingDayOfWeek = new Date(schedule[schedule.length - 1]).getDay();
			if (endingDayOfWeek < 5) {
				schedule.push('');
			}

			var weeks = Math.round(schedule.length / 5);
			var schoolDays = 5;
			for (var i = 0; i < weeks; i++) {
				$scope.schedule[i] = [];
				for (var z = 0; z < schoolDays; z++) {
					$scope.schedule[i][z] = schedule[i * (schoolDays) + z];
				}
			}
		});

	Schedule
		.getRaw()
		.$promise.then(function(rawSchedule) {
			if (rawSchedule.startDate) {
				$scope.newSchedule.startDate = new Date(rawSchedule.startDate);
				$scope.newSchedule.fakeEndDate = new Date(rawSchedule.endDate);
				$scope.newSchedule.submissionTime = new Date(0, 0, 0, rawSchedule.schedules[0].h[0], 0, 0);
				$scope.newSchedule.fakeEndDate.setDate($scope.newSchedule.fakeEndDate.getDate() - 1);
				$scope.newSchedule.datesToSkip = undefined;
			}
		});
}]).controller('DashboardAnalyticsController', ['$scope', function($scope) {

}]).controller('DashboardUsersController', ['$scope', 'MessageService', 'PanelUser', function($scope, MessageService, User) {
	$scope.csvFile = null;
	$scope.newUser = {};

	$scope.deleteUser = function(user) {
		user
			.$delete()
			.then(function(deletedUser) {
				if (deletedUser.email) {
					MessageService.showSuccessNotification('Deleted ' +
						deletedUser.email);
					$scope.users.splice($scope.users.indexOf(user), 1);
				}
			})
			.catch(function(response) {
				MessageService.showFailureNotification('Failed to delete ' +
					user.email);
			});
	};

	$scope.inviteRequestedUser = function(requestedUser) {
		User
			.invite({
				email: requestedUser.email,
				isAdmin: requestedUser.isAdmin
			})
			.$promise.then(function(user) {
				requestedUser.status = 'Invited';
				MessageService.showSuccessNotification('Successfully invited ' + user.email);
			})
			.catch(function(response) {
				MessageService.showDefaultFailureNotification();
				debugger;
			});
	};

	$scope.inviteNewUser = function() {
		if ($scope.newUser.email) {
			User
				.invite($scope.newUser)
				.$promise.then(function(user) {
					$scope.users.push(user);
					$scope.newUser = {};
					$scope.inviteUserForm.$setPristine();
					MessageService.showSuccessNotification('Successfully invited ' + user.email);
				})
				.catch(function(response) {
					MessageService.showDefaultFailureNotification();
					debugger;
				});
		}
	};

	$scope.inviteUsersFromCSV = function() {
		var csvFileInput = document.getElementById('csvFileInput');
		var file = csvFileInput.files[0];

		if (file) {
			var data = new FormData();
			data.append('users', file);

			User
				.inviteBulk(data)
				.$promise.then(function(users) {
					$scope.users = $scope.users.concat(users);
				})
				.catch(function(response) {
					debugger;
				});
		} else {
			// TODO show some sort of error
		}
	};

	User
		.query()
		.$promise.then(function(users) {
			$scope.users = users;
		})
		.catch(function(response) {
			debugger;
		});
}]).controller('EditItemController', ['$scope', '$mdDialog', 'editingItem',
	function($scope, $mdDialog, editingItem) {
		$scope.editingItem = editingItem;

		$scope.update = function() {
			$mdDialog.hide(editingItem);
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
}]);
