angular.module('hthsLunch.panel')
  .directive('barGraph', [function() {
    return {
      restrict: 'E',
      replace: false,
      link: function(scope, element, attrs) {
        var data = {
          // A labels array that can contain any sort of values
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          // Our series array that contains series objects or in this case series data arrays
          series: [
            [5, 2, 4, 2, 0]
          ]
        };

        var options = {
          width: attrs.gWidth,
          height: attrs.gHeight
        };

        var xyz = new Chartist.Bar('.' + attrs.gName, data, options);
      }
    };
  }]);
