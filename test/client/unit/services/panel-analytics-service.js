describe('Unit: Testing Services', function() {
  describe('Panel Analytics Service:', function() {
    var $httpBackend;
    var AnalyticsService;

    beforeEach(module('hthsLunch'));
    beforeEach(inject(function(_$httpBackend_, _PanelAnalytics_) {
      $httpBackend = _$httpBackend_;
      AnalyticsService = _PanelAnalytics_;
    }));
  });
});
