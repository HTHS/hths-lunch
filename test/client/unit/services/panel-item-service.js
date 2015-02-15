describe('Unit: Testing Services', function() {
  describe('Panel Item Service:', function() {
    var $httpBackend;
    var ItemService;

    beforeEach(module('hthsLunch'));
    beforeEach(inject(function(_$httpBackend_, _PanelItem_) {
      $httpBackend = _$httpBackend_;
      ItemService = _PanelItem_;
    }));
  });
});
