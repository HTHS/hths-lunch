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
					},
					onEnter: function($state, PanelUser) {
						if (user) {
							PanelUser
								.hasAuthorization({
									user: user._id
								})
								.$promise.then(function(user) {
									if (!user.authorized) {
										$state.go('landingPage');
									}
								}).catch(function(response) {
									if (response.status === 403) {
										$state.go('landingPage');
									}
								});
						} else {
							$state.go('landingPage');
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
				}).state('dashboard.schedule', {
					url: '/schedule',
					views: {
						'main': {
							controller: 'DashboardController',
							templateUrl: '/modules/panel/partials/dashboard.html'
						},
						'dashboard': {
							controller: 'DashboardScheduleController',
							templateUrl: '/modules/panel/partials/schedule.html'
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
				}).state('dashboard.users', {
					url: '/users',
					views: {
						'main': {
							controller: 'DashboardController',
							templateUrl: '/modules/panel/partials/dashboard.html'
						},
						'dashboard': {
							controller: 'DashboardUsersController',
							templateUrl: '/modules/panel/partials/users.html'
						}
					}
				});
		}
	]);
