angular.module('hthsLunch.panel')
	.directive('barGraph', [function() {
		return {
			restrict: 'E',
			scope: {
				data: '='
			},
			link: function($scope, element, attrs) {
				var data = {
					// A labels array that can contain any sort of values
					labels: $scope.data.labels,
					// Our series array that contains series objects or in this case series data arrays
					series: [$scope.data.data]
				};

				var options = {};

				if (attrs.gWidth && attrs.gHeight) {
					options.width = attrs.gWidth;
					options.height = attrs.gHeight;
				}

				$scope.graph = new Chartist.Bar(element[0], data, options);
			}
		};
	}])
	.directive('lineChart', [function() {
		return {
			restrict: 'E',
			scope: {
				data: '='
			},
			link: function($scope, element, attrs) {
				var data = {
					// A labels array that can contain any sort of values
					labels: $scope.data.labels,
					// Our series array that contains series objects or in this case series data arrays
					series: [$scope.data.data]
				};

				var options = {
					lineSmooth: false,
					low: 0,
					showArea: true
				};

				if (attrs.gWidth && attrs.gHeight) {
					options.width = attrs.gWidth;
					options.height = attrs.gHeight;
				}

				$scope.graph = new Chartist.Line(element[0], data, options);
			}
		};
	}]);
