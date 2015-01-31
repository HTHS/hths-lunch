angular.module('hthsLunch.landingPage', [
  'ui.router',
  'hthsLunch.core.authService',
  'hthsLunch.core.messageService'
]);
angular.module('hthsLunch.user', [
  'ui.router',
  'hthsLunch.core.authService'
]);
angular.module('hthsLunch.order', [
  'ui.router',
  'hthsLunch.core.itemService',
  'hthsLunch.core.orderService',
  'hthsLunch.core.userService',
  'hthsLunch.core.authService',
  'hthsLunch.core.databaseService'
]);
angular.module('hthsLunch.panel', [
  'ui.router',
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
      .primaryPalette('blue')
      .accentPalette('green');
  }
]);
