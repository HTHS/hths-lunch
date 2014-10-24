angular.module('hthsLunch.landingPage').controller('LandingPageController', ['$scope', '$window', '$state', function(
	$scope,
	$window, $state) {
	if (user) {
		$state.go('order');
	}

	$scope.authenticate = function() {
		$window.location.href += 'auth/google';
	};
}]);
