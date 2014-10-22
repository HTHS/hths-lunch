angular.module('hthsLunch.landingPage').controller('LandingPageController', ['$scope', '$state', function($scope,
	$state) {
	if (user) {
		$state.go('order');
	}
}]);
