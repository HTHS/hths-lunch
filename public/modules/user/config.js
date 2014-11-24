angular.module('hthsLunch.user')
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('userProfile', {
          url: '/profile/me',
          views: {
            'main': {
              controller: 'UserProfileController',
              templateUrl: '/modules/user/partials/profile.html'
            }
          }
        });
    }
  ]);
