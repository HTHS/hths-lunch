angular.module('hthsLunch.landingPage').controller('LandingPageController', ['$scope', '$window', '$state', 'User',
	function(
		$scope,
		$window, $state, User) {
		if (user) {
			$state.go('order');
		}

		$scope.authenticateOrRequestInvite = function() {
			User
				.hasAccount({
					email: $scope.email
				})
				.$promise.then(function(hasAccount) {
					if (hasAccount) {
						// TODO better routing here
						$window.location.href += 'auth/google';
					} else {
						// request invite
						// either through panel, or through email
					}
				});
		};
	}
]);
