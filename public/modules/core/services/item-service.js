angular.module('hthsLunch.core.itemService', ['ngResource']).factory('Item', [
	'$resource',
	function($resource) {
		return $resource('/api/items/:itemId', {
			itemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
