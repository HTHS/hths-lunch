$(document).foundation();

angular.module('hthsLunch.order', ['hthsLunch.core.itemService',
	'hthsLunch.core.orderService'
]);
angular.module('hthsLunch.panel', ['ngResource']);

angular.module('hthsLunch', [
	'ui.router',
	'hthsLunch.order',
	'hthsLunch.panel'
]).config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');
}]);
