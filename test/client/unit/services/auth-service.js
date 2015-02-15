describe('Unit: Testing Services', function() {
  describe('Authentication Service:', function() {

    var $httpBackend;
    var AuthService;

    beforeEach(module('hthsLunch'));
    beforeEach(inject(function(_$httpBackend_, _Auth_) {
      $httpBackend = _$httpBackend_;
      AuthService = _Auth_;
    }));

    it('should be able to signout', function() {
      $httpBackend
        .expectGET('/api/auth/signout')
        .respond({
          success: true
        });

      var result = AuthService.signout();

      $httpBackend.flush();

      expect(angular.isObject(result)).toEqual(true);
      expect(result.success).toEqual(true);
    });
  });
});
