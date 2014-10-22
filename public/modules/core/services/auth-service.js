angular.module('hthsLunch.core.authService', ['ngResource']).factory('Auth', [
	'$resource',
	function($resource) {
		return $resource('/api/auth', {}, {
			signout: {
				url: '/api/auth/signout',
				method: 'GET'
			}
		});
	}
]);
