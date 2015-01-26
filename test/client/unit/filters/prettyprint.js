describe('Unit: Testing Filters', function() {

  var $filter;

  beforeEach(module('hthsLunch.panel'));
  beforeEach(inject(function(_$filter_) {
    $filter = _$filter_;
  }));

  it('should prettyprint data properly', function() {
    var testData = {
      items: [{
        title: 'Pizza'
      }, {
        title: 'Hamburgers'
      }, {
        title: 'Sandwiches'
      }, {
        title: 'Yogurt'
      }],
      quantity: [
        1,
        2,
        3,
        4
      ]
    };

    var prettyPrintedData = $filter('prettyprint')(testData);
    expect(prettyPrintedData).toEqual('Pizza x1, Hamburgers x2, Sandwiches x3, Yogurt x4');
  });
});
