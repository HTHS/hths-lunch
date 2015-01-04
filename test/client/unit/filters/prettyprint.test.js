describe("Unit: Testing Filters", function() {

	beforeEach(module('hthsLunch'));

	it('should contain a prettyprint filter',
		inject(['prettyprint', function(prettyprint) {
			expect(prettyprint).not.to.equal(null);
		}]));

	it('should prettyprint data properly',
		inject(['prettyprint', function(prettyprint) {
			var testData = {
				items: [{
					title: 'Pizza'
				}, {
					title: 'Hamburgers'
				}, {
					title: 'Sandwiches'
				}, {
					title: 'Yogurt'
				}],
				quantity: [
					1,
					2,
					3,
					4
				]
			};
			var prettyPrintedData = prettyprint(testData);
			expect(prettyPrintedData).to.equal(
				'Pizza x1, Hamburgers x2, Sandwiches x3, Yogurt x4');
		}]));
});
