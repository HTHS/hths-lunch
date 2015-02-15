describe('Unit: Testing Services', function() {
	describe('User Service:', function() {
		var $httpBackend;
		var UserService;

		beforeEach(module('hthsLunch'));
		beforeEach(inject(function(_$httpBackend_, _User_) {
			$httpBackend = _$httpBackend_;
			UserService = _User_;
		}));

		it('should be able to get the currently logged in user', function() {
			$httpBackend
				.expectGET('/api/users/me')
				.respond({
					'_id': '5482a029bc5ddbc10bea8d1f',
					'updated': '2015-02-14T15:39:27.189Z',
					'displayName': 'Ilan Biala',
					'email': 'ibiala@ctemc.org',
					'provider': 'google',
					'providerData': {
						'id': '116245599571148894066',
						'email': 'ibiala@ctemc.org',
						'verified_email': true,
						'name': 'Ilan Biala',
						'given_name': 'Ilan',
						'family_name': 'Biala',
						'link': 'https://plus.google.com/116245599571148894066',
						'picture': 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
						'locale': 'en',
						'hd': 'ctemc.org',
						'accessToken': 'ya29._QBWx36If_LrPvheb7h2nrNKnV4NCk8umwXPq5TcAkB5KXvvKoAp0yGRPG1l6Mm0DY_JVXb0BlizdQ',
						'refreshToken': null
					},
					'__v': 9,
					'orderHistory': [{
						'_id': '54d193a3a84f74c10abd4b5c',
						'total': 5.85,
						'customer': 'Ilan Biala',
						'user': '5482a029bc5ddbc10bea8d1f',
						'__v': 0,
						'updated': '2015-02-04T03:36:03.433Z',
						'created': '2015-02-04T03:36:03.430Z',
						'quantity': [1],
						'items': ['543b032fd11f8c0c04bf73fe'],
						'id': '54d193a3a84f74c10abd4b5c'
					}],
					'status': 'Created',
					'created': '2014-12-06T06:20:25.617Z',
					'isAdmin': true,
					'lastName': 'Biala',
					'firstName': 'Ilan',
					'id': '5482a029bc5ddbc10bea8d1f'
				});

			var me = UserService.me();

			$httpBackend.flush();

			expect(angular.isObject(me)).toEqual(true);
			expect(me._id).toEqual('5482a029bc5ddbc10bea8d1f');
			expect(me.status).toEqual('Created');
			expect(me.orderHistory.length).toEqual(1);
		});

		it('should be able to update the currently logged in user', function() {
			$httpBackend
				.expectPUT('/api/users/54df6c252e2de2ae33e8d626')
				.respond({
					_id: '54df6c252e2de2ae33e8d626'
				});

			var user = UserService.update({
				_id: '54df6c252e2de2ae33e8d626'
			});

			$httpBackend.flush();

			expect(angular.isObject(user)).toEqual(true);
			expect(user._id).toEqual('54df6c252e2de2ae33e8d626');
		});

		it('should be able to check if an email address is tied to an account', function() {
			$httpBackend
				.expectPOST('/api/users/hasAccount')
				.respond({
					hasAccount: false,
					pending: false
				});

			var result = UserService.hasAccount({
				email: 'ibiala@ctemc.org'
			});

			$httpBackend.flush();

			expect(angular.isObject(result)).toEqual(true);
			expect(result.hasAccount).toEqual(false);
			expect(result.pending).toEqual(false);
		});

		it('should be able to request an invite', function() {
			$httpBackend
				.expectPOST('/api/users/requestInvite')
				.respond({
					email: 'ibiala@ctemc.org',
					_id: '54df6c252e2de2ae33e8d626'
				});

			var user = UserService.requestInvite({
				email: 'ibiala@ctemc.org'
			});

			$httpBackend.flush();

			expect(angular.isObject(user)).toEqual(true);
			expect(user.email).toEqual('ibiala@ctemc.org');
			expect(user._id).toEqual('54df6c252e2de2ae33e8d626');
		});
	});
});
