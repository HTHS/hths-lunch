describe('Unit: Testing Directives', function() {

  var $compile, $rootScope;

  beforeEach(module('hthsLunch'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  xit('should compile with no errors when given no data', function() {
		var $scope = $rootScope.$new();
		$scope.topItemsData = [];
		var html = '<bar-graph class="ct-chart ct-perfect-fourth" data="topItemsData" ng-if="topItemsData"></bar-graph>';
		var element = $compile(html)($scope);
		$scope.$digest();

		console.log(element);
		expect(element.length).toEqual(1);
	});

	xit('should compile with no errors when given data', function() {
    var $scope = $rootScope.$new();
    $scope.topItemsData = [{
		  '_id': '543b032fd11f8c0c04bf73fe',
		  'title': 'Breaded Chicken Sandwich',
		  'description': 'With ketchup',
		  'price': 5.85,
		  '__v': 0,
		  'created': '2015-02-15T13:56:28.479Z',
		  'numberOrdered': 28,
		  'active': true
		}, {
		  '_id': '543b0466d11f8c0c04bf7402',
		  'title': 'Buffalo Chicken Wrap',
		  'description': 'with Lettuce & Tomato (Ranch on side)',
		  'price': 5.75,
		  '__v': 0,
		  'created': '2015-02-15T13:56:28.479Z',
		  'numberOrdered': 12,
		  'active': true
		}];
    var html = '<bar-graph class="ct-chart ct-perfect-fourth" data="topItemsData" ng-if="topItemsData"></bar-graph>';
    var element = $compile(html)($scope);
		$scope.$digest();

    console.log(element);

    expect(element.html()).to.match(/Welcome/i);
  });

});

// <bar-graph class="ct-chart ct-perfect-fourth" data="topItemsData" ng-if="topItemsData"></bar-graph>
