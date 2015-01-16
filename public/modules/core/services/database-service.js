angular.module('hthsLunch.core.databaseService', ['hthsLunch.core.itemService', 'hthsLunch.core.orderService', 'hthsLunch.core.userService'])
	.factory('Database', ['$q', 'Item', 'Order', 'User', function($q, Item, Order, User) {
		var service = {};

		var me;

		var meQuery = User.me().$promise;
		meQuery.then(function(user) {
			me = user;
		});

		service.getMe = function() {
			return me;
		};

		service.fetchAll = function() {
			return $q.all([meQuery]);
		};

		return service;
	}]);
