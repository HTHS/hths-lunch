angular.module('hthsLunch.core.itemService', ['ngResource']).factory('Item', [
	'$resource',
	function($resource) {
		return $resource('/api/panel/items/:itemId', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);