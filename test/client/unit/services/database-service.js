describe('Unit: Testing Services', function() {

	var $httpBackend;
	var Database;

	beforeEach(module('hthsLunch'));
	beforeEach(inject(function(_$httpBackend_, _Database_) {
		$httpBackend = _$httpBackend_;
		Database = _Database_;
	}));

	it('should be able to fetch the user', function() {
		$httpBackend
			.expectGET('/api/users/me')
			.respond({
				email: 'ibiala@ctemc.org',
				orderHistory: []
			});

		var query = Database.fetchMe();

		query.then(function(me) {
			expect(angular.isObject(me)).toEqual(true);
			expect(me.email).toEqual('ibiala@ctemc.org');
		});

		$httpBackend.flush();
	});

	it('should be able to get the locally cached user', function() {
		$httpBackend
			.expectGET('/api/users/me')
			.respond({
				email: 'ibiala@ctemc.org',
				orderHistory: []
			});

		var query = Database.fetchMe();

		query.then(function() {
			var me = Database.getMe();

			expect(angular.isObject(me)).toEqual(true);
			expect(me.email).toEqual('ibiala@ctemc.org');
		});

		$httpBackend.flush();
	});

	it('should be able to update the user', function() {
		$httpBackend
			.expectPUT('/api/users/abc123')
			.respond({
				email: 'ibiala2@ctemc.org',
				_id: 'abc123',
				orderHistory: []
			});

		var query = Database.updateMe({
			email: 'ibiala2@ctemc.org',
			_id: 'abc123',
			orderHistory: []
		});

		query.then(function(newMe) {
			expect(angular.isObject(newMe)).toEqual(true);
			expect(newMe.email).toEqual('ibiala2@ctemc.org');

			var me = Database.getMe();
			expect(angular.isObject(me)).toEqual(true);
			expect(me.email).toEqual('ibiala2@ctemc.org');
		});

		$httpBackend.flush();
	});

	it('should be able to save the order and update the user\'s order history', function() {
		$httpBackend
			.expectGET('/api/users/me')
			.respond({
				email: 'ibiala@ctemc.org',
				_id: 'abc123',
				orderHistory: []
			});

		$httpBackend
			.expectPOST('/api/orders')
			.respond({
				total: 5.75,
				_id: '12308i5'
			});

		$httpBackend
			.expectPUT('/api/users/abc123')
			.respond({
				email: 'ibiala2@ctemc.org',
				_id: 'abc123',
				orderHistory: ['12308i5']
			});

		var userQuery = Database.fetchMe();

		userQuery.then(function() {
			var orderQuery = Database.saveOrder({
				total: 5.75
			});

			orderQuery.then(function(user) {
				expect(angular.isObject(user)).toEqual(true);
				expect(user.orderHistory.length).toEqual(1);
			});
		});

		$httpBackend.flush();
	});

	it('should be able to update an order', function() {
		$httpBackend
			.expectPUT('/api/orders/12308i5')
			.respond({
				total: 8.75,
				_id: '12308i5'
			});

		var query = Database.updateOrder({
			total: 8.75,
			_id: '12308i5'
		});

		query.then(function(order) {
			expect(angular.isObject(order)).toEqual(true);
			expect(order.total).toEqual(8.75);
			expect(order._id).toEqual('12308i5');
		});

		$httpBackend.flush();
	});

	it('should be able to fetch all data', function() {
		$httpBackend
			.expectGET('/api/users/me')
			.respond({
				email: 'ibiala@ctemc.org'
			});

		var results = Database.fetchAll();

		results.then(function(results) {
			var me = results.me;

			expect(angular.isObject(results)).toEqual(true);
			expect(angular.isObject(me)).toEqual(true);
			expect(me.email).toEqual('ibiala@ctemc.org');
		});

		$httpBackend.flush();
	});

});
