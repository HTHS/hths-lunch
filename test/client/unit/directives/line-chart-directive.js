describe('Unit: Testing Directives', function() {

  var $compile, $rootScope;

  beforeEach(module('hthsLunch'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

	xit('should compile with no errors when given no data', function() {
		var $scope = $rootScope.$new();
		$scope.ordersPerDayData = [];
		var html = '<line-chart class="ct-chart ct-perfect-fourth" data="ordersPerDayData" ng-if="ordersPerDayData"></line-chart>';
		var element = $compile(html)($scope);
		$scope.$digest();

		console.log(element);
		expect(element.length).toEqual(1);
	});

  xit('should compile with no errors', function() {
    var $scope = $rootScope.$new();
    $scope.ordersPerDayData = [{
		  '_id': '54d802fe378d223705644746',
		  '__v': 0,
		  'orders': ['54d802434d0580a90404ea02'],
		  'date': '2015-02-09T00:44:46.386Z'
		}, {
		  '_id': '54d803210da7fb3d05eb81ae',
		  '__v': 0,
		  'orders': ['54d802434d0580a90404ea02'],
		  'date': '2015-02-09T00:45:21.649Z'
		}, {
		  '_id': '54d8037b9a5cdf52053c9d1a',
		  '__v': 0,
		  'orders': ['54d802434d0580a90404ea02'],
		  'date': '2015-02-09T00:46:51.878Z'
		}];
    var html =
      '<line-chart class="ct-chart ct-perfect-fourth" data="ordersPerDayData" ng-if="ordersPerDayData"></line-chart>';
    var element = $compile(html)($scope);
		$scope.$digest();

    console.log(element);

    expect(element.html()).to.match(/Welcome/i);
  });

});

// <line-chart class="ct-chart ct-perfect-fourth" data="ordersPerDayData" ng-if="ordersPerDayData"></line-chart>
