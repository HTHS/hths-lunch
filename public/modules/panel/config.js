angular.module('hthsLunch.panel')
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('dashboard', {
					url: '/panel',
					views: {
						'main': {
							controller: 'DashboardController',
							templateUrl: '/modules/panel/partials/dashboard.html'
						},
						'dashboard': {
							controller: 'DashboardController',
							templateUrl: '/modules/panel/partials/index.html'
						}
					}
				}).state('dashboard.items', {
					url: '/items',
					views: {
						'main': {
							controller: 'DashboardController',
							templateUrl: '/modules/panel/partials/dashboard.html'
						},
						'dashboard': {
							controller: 'DashboardItemsController',
							templateUrl: '/modules/panel/partials/items.html'
						}
					}
				}).state('dashboard.orders', {
					url: '/orders',
					views: {
						'main': {
							controller: 'DashboardController',
							templateUrl: '/modules/panel/partials/dashboard.html'
						},
						'dashboard': {
							controller: 'DashboardOrdersController',
							templateUrl: '/modules/panel/partials/orders.html'
						}
					}
				}).state('dashboard.analytics', {
					url: '/analytics',
					views: {
						'main': {
							controller: 'DashboardController',
							templateUrl: '/modules/panel/partials/dashboard.html'
						},
						'dashboard': {
							controller: 'DashboardAnalyticsController',
							templateUrl: '/modules/panel/partials/analytics.html'
						}
					}
				});
		}
	]);