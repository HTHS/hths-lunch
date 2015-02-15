describe('Unit: Testing Services', function() {

  var $httpBackend;
  var OrderService;

  beforeEach(module('hthsLunch'));
  beforeEach(inject(function(_$httpBackend_, _Order_) {
    $httpBackend = _$httpBackend_;
    OrderService = _Order_;
  }));

  it('should be able to create an order', function() {
    $httpBackend
      .expectPOST('/api/orders')
      .respond({
        '_id': '54df6c252e2de2ae33e8d626',
        'total': 15.10,
        'customer': 'Ilan Biala',
        'user': '5482a029bc5ddbc10bea8d1f',
        '__v': 1,
        'updated': '2015-02-14T15:39:27.174Z',
        'created': '2015-02-14T15:39:17.928Z',
        'quantity': [2, 1],
        'items': [{
          '_id': '543b032fd11f8c0c04bf73fe',
          'title': 'Breaded Chicken Sandwich',
          'description': 'With ketchup',
          'price': 5.85,
          '__v': 0,
          'created': '2015-02-15T00:56:29.814Z',
          'numberOrdered': 28,
          'active': true
        }, {
          '_id': '543b026bcba88ebb0251dcef',
          'title': 'Cheeseburger',
          'description': 'with ketchup',
          'price': 3.4,
          '__v': 0,
          'created': '2015-02-15T00:56:29.814Z',
          'numberOrdered': 1,
          'active': true
        }]
      });

    var order = OrderService.save();

    $httpBackend.flush();

    expect(angular.isObject(order)).toEqual(true);
    expect(order.total).toEqual(15.10);
    expect(order.quantity).toEqual([2, 1]);
    expect(order.items.length).toEqual(order.items.length);
  });

  it('should be able to get a particular order', function() {
    $httpBackend
      .expectGET('/api/orders/54df6c252e2de2ae33e8d626')
      .respond({
        '_id': '54df6c252e2de2ae33e8d626',
        'total': 15.10,
        'customer': 'Ilan Biala',
        'user': '5482a029bc5ddbc10bea8d1f',
        '__v': 1,
        'updated': '2015-02-14T15:39:27.174Z',
        'created': '2015-02-14T15:39:17.928Z',
        'quantity': [2, 1],
        'items': [{
          '_id': '543b032fd11f8c0c04bf73fe',
          'title': 'Breaded Chicken Sandwich',
          'description': 'With ketchup',
          'price': 5.85,
          '__v': 0,
          'created': '2015-02-15T00:56:29.814Z',
          'numberOrdered': 28,
          'active': true
        }, {
          '_id': '543b026bcba88ebb0251dcef',
          'title': 'Cheeseburger',
          'description': 'with ketchup',
          'price': 3.4,
          '__v': 0,
          'created': '2015-02-15T00:56:29.814Z',
          'numberOrdered': 1,
          'active': true
        }]
      });

    var order = OrderService.get({
      orderId: '54df6c252e2de2ae33e8d626'
    });

    $httpBackend.flush();

    expect(angular.isObject(order)).toEqual(true);
    expect(order.total).toEqual(15.10);
    expect(order.quantity).toEqual([2, 1]);
    expect(order.items.length).toEqual(order.items.length);
  });

  it('should be able to update an order', function() {
    $httpBackend
      .expectPUT('/api/orders/54df6c252e2de2ae33e8d626')
      .respond({
        '_id': '54df6c252e2de2ae33e8d626',
        'total': 18.50,
        'customer': 'Ilan Biala',
        'user': '5482a029bc5ddbc10bea8d1f',
        '__v': 2,
        'updated': '2015-02-14T15:39:27.174Z',
        'created': '2015-02-14T15:39:17.928Z',
        'quantity': [2, 2],
        'items': [{
          '_id': '543b032fd11f8c0c04bf73fe',
          'title': 'Breaded Chicken Sandwich',
          'description': 'With ketchup',
          'price': 5.85,
          '__v': 0,
          'created': '2015-02-15T00:56:29.814Z',
          'numberOrdered': 28,
          'active': true
        }, {
          '_id': '543b026bcba88ebb0251dcef',
          'title': 'Cheeseburger',
          'description': 'with ketchup',
          'price': 3.4,
          '__v': 0,
          'created': '2015-02-15T00:56:29.814Z',
          'numberOrdered': 1,
          'active': true
        }]
      });

    var order = OrderService.update({
      '_id': '54df6c252e2de2ae33e8d626',
      'total': 18.50,
      'customer': 'Ilan Biala',
      'user': '5482a029bc5ddbc10bea8d1f',
      'quantity': [2, 2],
      'items': ['543b032fd11f8c0c04bf73fe', '543b026bcba88ebb0251dcef']
    });

    $httpBackend.flush();

    expect(angular.isObject(order)).toEqual(true);
    expect(order.total).toEqual(18.50);
    expect(order.quantity).toEqual([2, 2]);
    expect(order.items.length).toEqual(order.items.length);
  });

	it('should be able to delete an order', function() {
		$httpBackend
			.expectDELETE('/api/orders/54df6c252e2de2ae33e8d626')
			.respond({
				'_id': '54df6c252e2de2ae33e8d626',
				'total': 18.50,
				'customer': 'Ilan Biala',
				'user': '5482a029bc5ddbc10bea8d1f',
				'__v': 2,
				'updated': '2015-02-14T15:39:27.174Z',
				'created': '2015-02-14T15:39:17.928Z',
				'quantity': [2, 2],
				'items': [{
					'_id': '543b032fd11f8c0c04bf73fe',
					'title': 'Breaded Chicken Sandwich',
					'description': 'With ketchup',
					'price': 5.85,
					'__v': 0,
					'created': '2015-02-15T00:56:29.814Z',
					'numberOrdered': 28,
					'active': true
				}, {
					'_id': '543b026bcba88ebb0251dcef',
					'title': 'Cheeseburger',
					'description': 'with ketchup',
					'price': 3.4,
					'__v': 0,
					'created': '2015-02-15T00:56:29.814Z',
					'numberOrdered': 1,
					'active': true
				}]
			});

		var order = OrderService.delete({orderId: '54df6c252e2de2ae33e8d626'});

		$httpBackend.flush();

		expect(angular.isObject(order)).toEqual(true);
		expect(order.total).toEqual(18.50);
		expect(order.quantity).toEqual([2, 2]);
		expect(order.items.length).toEqual(order.items.length);
	});
});
