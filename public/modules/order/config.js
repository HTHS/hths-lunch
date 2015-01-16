angular.module('hthsLunch.order')
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('order', {
					url: '/order',
					views: {
						'main': {
							controller: 'OrderController',
							templateUrl: '/modules/order/partials/order.html'
						}
					},
					resolve: {
						Database: 'Database',
						data: function(Database) {
							return Database.fetchAll();
						}
					}
				});
		}
	]);
