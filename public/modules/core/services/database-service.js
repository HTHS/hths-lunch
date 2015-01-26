angular.module('hthsLunch.core.databaseService', ['hthsLunch.core.itemService', 'hthsLunch.core.orderService',
		'hthsLunch.core.userService', 'hthsLunch.core.authService'
	])
	.factory('Database', ['$q', 'Item', 'Order', 'User', 'Auth', function($q, Item, Order, User, Auth) {
		var service = {};

		var me;

		service.getMe = function() {
			return me;
		};

		service.fetchMe = function() {
			var promise = User.me().$promise;

			promise
				.then(function(user) {
					me = user;
				})
				.catch(function(response) {
					if (response.status === 401) {
						me = null;
					}
				});

			return promise;
		};

		service.fetchAll = function() {
			return $q.all([this.fetchMe()]);
		};

		return service;
	}]);
