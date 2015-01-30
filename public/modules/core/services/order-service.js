angular.module('hthsLunch.core.orderService', ['ngResource']).factory('Order', [
	'$resource',
	function($resource) {
		return $resource('/api/orders/:orderId', {
			'orderId': '@_id'
		}, {
			update: {
				method: 'PUT'
			},
		});
	}
]);
