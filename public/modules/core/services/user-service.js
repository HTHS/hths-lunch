angular.module('hthsLunch.core.userService', ['ngResource']).factory('User', [
	'$resource',
	function($resource) {
		return $resource('/api/users/:userId', {
			'userId': '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			hasAccount: {
				url: '/api/users/hasAccount',
				method: 'POST',
				interceptor: {
					response: function(response) {
						return response.resource.hasAccount;
					},
					responseError: function(data) {

					}
				}
			}
		});
	}
]);
