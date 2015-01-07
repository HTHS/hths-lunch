angular.module('hthsLunch.core.databaseService', ['ngResource'])
	.factory('Item', ['$resource', function($resource) {
		return $resource('/api/items/:itemId', {
			itemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}]);
