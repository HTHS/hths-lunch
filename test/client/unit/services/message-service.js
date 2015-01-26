describe('Unit: Testing Services', function() {

	var MessageService;

	beforeEach(module('hthsLunch'));
	beforeEach(inject(function(_MessageService_) {
		MessageService = _MessageService_;
	}));

	it('should have sane defaults', function() {
		expect(MessageService.getDefaultErrorMessage()).toEqual('An error occurred, please try again later');
		expect(MessageService.getDefaultPosition()).toEqual('top right');
		expect(MessageService.getDefaultHideDelay()).toEqual(3000);
	});

	it('should be able to change defaults', function() {
		MessageService
			.setDefaultErrorMessage('Kaboom! Something went wrong.')
			.setDefaultPosition('bottom right')
			.setDefaultHideDelay(5000);

		expect(MessageService.getDefaultErrorMessage()).toEqual('Kaboom! Something went wrong.');
		expect(MessageService.getDefaultPosition()).toEqual('bottom right');
		expect(MessageService.getDefaultHideDelay()).toEqual(5000);
	});
});
