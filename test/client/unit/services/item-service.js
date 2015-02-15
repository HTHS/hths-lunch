describe('Unit: Testing Services', function() {
	describe('Item Service:', function() {
		var $httpBackend;
		var ItemService;

		beforeEach(module('hthsLunch'));
		beforeEach(inject(function(_$httpBackend_, _Item_) {
			$httpBackend = _$httpBackend_;
			ItemService = _Item_;
		}));

		it('should be able to get all items', function() {
			$httpBackend
				.expectGET('/api/items')
				.respond([{
					'_id': '543b032fd11f8c0c04bf73fe',
					'title': 'Breaded Chicken Sandwich',
					'description': 'With ketchup',
					'price': 5.85,
					'__v': 0,
					'created': '2015-02-15T00:40:31.881Z',
					'numberOrdered': 28,
					'active': true
				}, {
					'_id': '543b0466d11f8c0c04bf7402',
					'title': 'Buffalo Chicken Wrap',
					'description': 'with Lettuce & Tomato (Ranch on side)',
					'price': 5.75,
					'__v': 0,
					'created': '2015-02-15T00:40:31.881Z',
					'numberOrdered': 12,
					'active': true
				}, {
					'_id': '543b026bcba88ebb0251dcef',
					'title': 'Cheeseburger',
					'description': 'with ketchup',
					'price': 3.4,
					'__v': 0,
					'created': '2015-02-15T00:40:31.881Z',
					'numberOrdered': 1,
					'active': true
				}]);

			var items = ItemService.query();

			$httpBackend.flush();

			expect(items[0]._id).toEqual('543b032fd11f8c0c04bf73fe');
			expect(items[1].description).toEqual('with Lettuce & Tomato (Ranch on side)');
			expect(items[2].active).toEqual(true);
		});

		it('should be able to get a particular item', function() {
			$httpBackend
				.expectGET('/api/items/543b032fd11f8c0c04bf73fe')
				.respond({
					'_id': '543b032fd11f8c0c04bf73fe',
					'title': 'Breaded Chicken Sandwich',
					'description': 'With ketchup',
					'price': 5.85,
					'__v': 0,
					'created': '2015-02-15T00:40:31.881Z',
					'numberOrdered': 28,
					'active': true
				});

			var item = ItemService.get({
				itemId: '543b032fd11f8c0c04bf73fe'
			});

			$httpBackend.flush();

			expect(item._id).toEqual('543b032fd11f8c0c04bf73fe');
			expect(item.title).toEqual('Breaded Chicken Sandwich');
			expect(angular.isObject(item)).toEqual(true);
		});
	});
});
