angular.module('hthsLunch.landingPage').controller('LandingPageController', ['$scope', '$window', '$state', 'Database',
	'MessageService', 'User',
	function($scope, $window, $state, Database, MessageService, User) {
		if (!Database.getMe()) {
			$state.go('order');
		}

		$scope.authenticateOrRequestInvite = function() {
			User
				.hasAccount({
					email: $scope.email
				})
				.$promise.then(function(result) {
					if (result.hasAccount && !result.pending) {
						// TODO better routing here
						$window.location.href += 'auth/google?email=' + $scope.email;
					} else if (!result.hasAccount) {
						User
							.requestInvite({
								email: $scope.email
							})
							.$promise.then(function(user) {
								MessageService.showSuccessNotification('Successfully requested invite for ' + user.email,
									'top right', 2000);
							})
							.catch(function(response) {
								MessageService.showDefaultFailureNotification();
							});
					} else if (result.hasAccount && result.pending) {
						MessageService.showFailureNotification('Please wait for an administrator to approve your request.',
							'top right', 5000);
					}
				})
				.catch(function(response) {
					MessageService.showDefaultFailureNotification();
				});
		};
	}
]);
