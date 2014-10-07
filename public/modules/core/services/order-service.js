angular.module('hthsLunch.core.orderService', ['ngResource']).factory('Order', [
	'$resource',
	function($resource) {
		return $resource('/api/panel/orders/:orderId', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);