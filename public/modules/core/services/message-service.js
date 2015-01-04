angular.module('hthsLunch.core.messageService', []).factory('MessageService', ['$mdToast', function($mdToast) {
	var service = {};
	var defaultErrorMessage = 'An error occurred, please try again later';
	var defaultPosition = 'top right';
	var defaultHideDelay = 3000;

	service.showSuccessNotification = function(message, position, hideDelay) {
		return $mdToast.show(
			$mdToast.simple()
			.content(message)
			.position(position || defaultPosition)
			.hideDelay(hideDelay || defaultHideDelay)
		);
	};

	service.showFailureNotification = function(message, position, hideDelay) {
		return $mdToast.show(
			$mdToast.simple()
			.content(message || defaultErrorMessage)
			.action('OK')
			.highlightAction(false)
			.position(position || defaultPosition)
			.hideDelay(hideDelay || defaultHideDelay)
		);
	};

	service.showDefaultFailureNotification = function() {
		return $mdToast.show(
			$mdToast.simple()
			.content(defaultErrorMessage)
			.action('OK')
			.highlightAction(false)
			.position(defaultPosition)
			.hideDelay(defaultHideDelay)
		);
	};

	return service;
}]);
