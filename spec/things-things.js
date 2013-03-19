describe('things', function() {
  it('should register a thing as an array', function() {
    var fakeDepArrayReturned = false;

    module
      .thing('fakeDepArray', fakes.fakeDepArray)
      .route('/fake-dep-array', function(fakeDepArray) {
        fakeDepArrayReturned = fakeDepArray === fakes.fakeDepArray;
      })
      .goTo('/fake-dep-array');

    expect(fakeDepArrayReturned).toBeTruthy();
  });

  it('should register a thing as a number', function() {
    var fakeDepNumberReturned = false;

    module
      .thing('fakeDepNumber', fakes.fakeDepNumber)
      .route('/fake-dep-number', function(fakeDepNumber) {
        fakeDepNumberReturned = fakeDepNumber === fakes.fakeDepNumber;
      })
      .goTo('/fake-dep-number');

    expect(fakeDepNumberReturned).toBeTruthy();
  });

  it('should register a thing as an object', function() {
    var fakeDepObjectReturned = false;

    module
      .thing('fakeDepObject', fakes.fakeDepObject)
      .route('/fake-dep-object', function(fakeDepObject) {
        fakeDepObjectReturned = fakeDepObject === fakes.fakeDepObject;
      })
      .goTo('/fake-dep-object');

    expect(fakeDepObjectReturned).toBeTruthy();
  });

  it('should register a thing as a function', function() {
    var fakeDepFunctionReturned = false;

    module
      .thing('fakeDepFunction', fakes.fakeDepFunction)
      .route('/fake-dep-function', function(fakeDepFunction) {
        fakeDepFunctionReturned = fakeDepFunction === noop;
      })
      .goTo('/fake-dep-function');

    expect(fakeDepFunctionReturned).toBeTruthy();
  });

  it('should execute a thing function each time', function() {
    var fakeDepThingFunctionCalled = 0;

    module
      .thing('fakeDepThingFunction', function() {
        fakeDepThingFunctionCalled++;
      })

      .route('/fake-thing-counter', function(fakeDepThingFunction) {})
      .goTo('/fake-thing-counter')

      .route('/fake-thing-counter-check-again', function(fakeDepThingFunction) {})
      .goTo('/fake-thing-counter-check-again')

      .route('/fake-thing-counter-check-one-more-time', function(fakeDepThingFunction) {})
      .goTo('/fake-thing-counter-check-one-more-time');

    expect(fakeDepThingFunctionCalled).toEqual(3);
  });

  it('should return an error message if a route is a dependency', function() {
    var routeInjected;

    module
      .route('fakeRoute', function() {})
      .thing('fakeThingThatRequiresRoute', function(fakeRoute) {
        routeInjected = typeof fakeRoute === 'function';
      })
      .route('fakeRouteThatRequiresFakeThingThatRequiresRoute', function(fakeThingThatRequiresRoute) {})
      .goTo('fakeRouteThatRequiresFakeThingThatRequiresRoute');

    expect(routeInjected).toBeFalsy();
  });
});
