angular.module('hthsLunch.core.userService', ['ngResource']).factory('User', [
	'$resource',
	function($resource) {
		return $resource('/api/users/:userId', {
			'userId': '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
