angular.module('hthsLunch.landingPage').controller('LandingPageController', ['$scope', '$window', '$mdToast', '$state', 'User',
	function($scope, $window, $mdToast, $state, User) {
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
						$mdToast.simple('No acount exists, please contact the administrator.');
						// request invite
						// either through panel, or through email
					}
				});
		};
	}
]);
