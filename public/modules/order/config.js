angular.module('hthsLunch.order')
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('order', {
					url: '/',
					views: {
						'main': {
							controller: 'OrderController',
							templateUrl: '/modules/order/partials/order.html'
						}
					}
				});
		}
	]);
