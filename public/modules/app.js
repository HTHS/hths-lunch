angular.module('hthsLunch.landingPage', [
  'hthsLunch.core.authService',
  'hthsLunch.core.messageService'
]);
angular.module('hthsLunch.user', ['hthsLunch.core.authService']);
angular.module('hthsLunch.order', [
  'hthsLunch.core.itemService',
  'hthsLunch.core.orderService',
  'hthsLunch.core.userService',
  'hthsLunch.core.authService',
  'hthsLunch.core.databaseService'
]);
angular.module('hthsLunch.panel', [
  'ngResource',
  'hthsLunch.core.messageService'
]);

angular.module('hthsLunch', [
  'ngMaterial',
  'ui.router',
  'hthsLunch.landingPage',
  'hthsLunch.user',
  'hthsLunch.order',
  'hthsLunch.panel'
]).config(['$locationProvider', '$mdThemingProvider',
  function($locationProvider, $mdThemingProvider) {
    $locationProvider
      .html5Mode(true)
      .hashPrefix('!');

    $mdThemingProvider
      .theme('default')
      .primaryColor('blue')
      .accentColor('green');
  }
]);
