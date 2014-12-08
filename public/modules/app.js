angular.module('hthsLunch.landingPage', ['hthsLunch.core.authService']);
angular.module('hthsLunch.user', ['hthsLunch.core.authService']);
angular.module('hthsLunch.order', ['hthsLunch.core.itemService',
	'hthsLunch.core.orderService', 'hthsLunch.core.userService',
	'hthsLunch.core.authService'
]);
angular.module('hthsLunch.panel', ['ngResource']);

angular.module('hthsLunch', [
	'ngMaterial',
	'ui.router',
	'hthsLunch.landingPage',
	'hthsLunch.user',
	'hthsLunch.order',
	'hthsLunch.panel'
]).config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');
}]);
