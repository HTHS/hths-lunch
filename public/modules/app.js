angular.module('hthsLunch.panel', ['hthsLunch.core.itemService',
	'hthsLunch.core.orderService'
]);

angular.module('hthsLunch', [
	'ui.router',
	'hthsLunch.panel'
]).config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');
}]);