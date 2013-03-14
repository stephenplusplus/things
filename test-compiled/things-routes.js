describe('routes', function() {
  var routeNoDepCalled = routeWithDepCalled = false;

  beforeEach(function() {
    module.route('/route-no-dep', function() {
      routeNoDepCalled = true;
    });

    module.route('/route-with-dep', function(fakeDepArray) {
      if (fakeDepArray === fakes.fakeDepArray) {
        routeWithDepCalled = true;
      }
    });
  });

  it('should execute route with no dependencies', function() {
    module.goTo('/route-no-dep');

    expect(routeNoDepCalled).toBeTruthy();
  });

  it('should execute route with a dependency', function() {
    module.goTo('/route-with-dep');

    expect(routeWithDepCalled).toBeTruthy();
  });
});
