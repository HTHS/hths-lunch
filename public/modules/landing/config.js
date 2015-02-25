angular.module('hthsLunch.landingPage')
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('landingPage', {
					url: '/',
					views: {
						'main': {
							controller: 'LandingPageController',
							templateUrl: '/modules/landing/partials/index.html'
						}
					}
				});

			$urlRouterProvider.otherwise('/');
		}
	]);
