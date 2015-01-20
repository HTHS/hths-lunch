angular.module('hthsLunch.core.userService', ['ngResource']).factory('User', [
	'$resource',
	function($resource) {
		return $resource('/api/users/:userId', {
			'userId': '@_id'
		}, {
			me: {
				url: '/api/users/me'
			},
			update: {
				method: 'PUT'
			},
			hasAccount: {
				url: '/api/users/hasAccount',
				method: 'POST'
			},
			requestInvite: {
				url: '/api/users/requestInvite',
				method: 'POST'
			}
		});
	}
]);
