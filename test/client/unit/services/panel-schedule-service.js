describe('Unit: Testing Services', function() {

	var $httpBackend;
	var ScheduleService;

	beforeEach(module('hthsLunch'));
	beforeEach(inject(function(_$httpBackend_, _PanelSchedule_) {
		$httpBackend = _$httpBackend_;
		ScheduleService = _PanelSchedule_;
	}));
});
