describe('Unit: Testing Services', function() {
  describe('Panel Item Service:', function() {
    var $httpBackend;
    var ItemService;

    beforeEach(module('hthsLunch'));
    beforeEach(inject(function(_$httpBackend_, _PanelItem_) {
      $httpBackend = _$httpBackend_;
      ItemService = _PanelItem_;
    }));

    it('should get all items', function() {
      $httpBackend
        .expectGET('/api/panel/items')
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

      expect(items[0].title).toEqual('Breaded Chicken Sandwich');
      expect(items[1].price).toEqual(5.75);
      expect(items[2].active).toEqual(true);
    });

    it('should get a specific item', function() {
      $httpBackend
        .expectGET('/api/panel/items/543b032fd11f8c0c04bf73fe')
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
    });

    it('should create and modify an item', function() {
      var newItem = {
        active: true,
        description: 'temporary',
        price: 3,
        title: 'New Item'
      };

      $httpBackend
        .expectPOST('/api/panel/items', newItem)
        .respond({
          '__v': 0,
          'price': 3,
          'title': 'New Item',
          'description': 'temporary',
          '_id': '54e238de116f53d333c002bb',
          'created': '2015-02-16T18:37:18.458Z',
          'numberOrdered': 0,
          'active': true
        });

      var item = ItemService.save(newItem);
      $httpBackend.flush();

      expect(item.numberOrdered).toEqual(0);
      expect(item.description).toEqual('temporary');

      $httpBackend
        .expectPUT('/api/panel/items/54e238de116f53d333c002bb')
        .respond({
          '__v': 0,
          'price': 3,
          'title': 'New Item',
          'description': 'temporary',
          '_id': '54e238de116f53d333c002bb',
          'created': '2015-02-16T18:37:18.458Z',
          'numberOrdered': 0,
          'active': false
        });

      item.active = false;
      item.$update();
      $httpBackend.flush();
    });
  });
});
