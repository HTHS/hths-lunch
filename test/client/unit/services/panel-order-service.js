describe('Unit: Testing Services', function() {
  describe('Panel Order Service:', function() {
    var $httpBackend;
    var OrderService;

    beforeEach(module('hthsLunch'));
    beforeEach(inject(function(_$httpBackend_, _PanelOrder_) {
      $httpBackend = _$httpBackend_;
      OrderService = _PanelOrder_;
    }));
  });
});
