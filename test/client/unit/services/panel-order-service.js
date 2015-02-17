describe('Unit: Testing Services', function() {
	describe('Panel Order Service:', function() {
		var $httpBackend;
		var OrderService;

		beforeEach(module('hthsLunch'));
		beforeEach(inject(function(_$httpBackend_, _PanelOrder_) {
			$httpBackend = _$httpBackend_;
			OrderService = _PanelOrder_;
		}));

		it('should get all orders, and delete one', function(){
			$httpBackend
				.expectGET('/api/panel/orders')
				.respond([{
					'_id': '54e150c1c8f78e016b7a5784',
					'total': 6.9,
					'customer': 'Matthew Ramina',
					'user': '54ce69a48375f6495456af90',
					'__v': 0,
					'updated': '2015-02-16T02:06:57.841Z',
					'created': '2015-02-16T02:06:57.837Z',
					'quantity': [1],
					'items': [{
							'_id': '54c69c51f65053d16369b36a',
							'title': 'pie',
							'description': 'it is good',
							'price': 6.9,
							'__v': 0,
							'created': '2015-01-26T19:58:09.383Z',
							'numberOrdered': 0,
							'active': true
						}]
				}, {
					'_id': '54ce7de56a18776e22a596d1',
					'total': 6.9,
					'customer': 'Matthew Ramina',
					'user': '54ce69a48375f6495456af90',
					'__v': 1,
					'updated': '2015-02-01T19:26:50.403Z',
					'created': '2015-02-01T19:26:29.805Z',
					'quantity': [1],
					'items': [{
							'_id': '54c69c51f65053d16369b36a',
							'title': 'pie',
							'description': 'it is good',
							'price': 6.9,
							'__v': 0,
							'created': '2015-01-26T19:58:09.383Z',
							'numberOrdered': 0,
							'active': true
						}]
				}]);

			var orders = OrderService.query();

			$httpBackend.flush();

			expect(orders.length).toEqual(2);
			expect(orders[0].customer).toEqual('Matthew Ramina');

			$httpBackend
				.expectDELETE('/api/panel/orders/54e150c1c8f78e016b7a5784')
				.respond(200, orders[0]);

			orders[0].$delete();
			
			$httpBackend.flush();
		});
	});
});
