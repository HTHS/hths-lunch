describe('Unit: Testing Services', function() {
  describe('Panel User Service:', function() {
    var $httpBackend;
    var UserService;

    beforeEach(module('hthsLunch'));
    beforeEach(inject(function(_$httpBackend_, _PanelUser_) {
      $httpBackend = _$httpBackend_;
      UserService = _PanelUser_;
    }));
  });
});
