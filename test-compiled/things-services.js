describe('services', function() {
  it('should not register an array as a service', function() {
    var fakeDepServiceArrayReturned = false;

    try {
      module
        .service('fakeDepServiceArray', fakes.fakeDepArray)
        .route('/fake-dep-service-array', function(fakeDepServiceArray) {
          tryfakeDepServiceArrayReturned = fakeDepServiceArray === fakes.fakeDepArray;
        })
        .goTo('/fake-dep-service-array');
    } catch(e) {
      fakeDepServiceArrayReturned = false;
    }

    expect(fakeDepServiceArrayReturned).toBeFalsy();
  });

  it('should not register a number a service', function() {
    var fakeDepServiceNumberReturned = false;

    try {
      module
        .service('fakeDepServiceNumber', fakes.fakeDepNumber)
        .route('/fake-dep-service-number', function(fakeDepServiceNumber) {
          fakeDepServiceNumberReturned = fakeDepServiceNumber === fakes.fakeDepNumber;
        })
        .goTo('/fake-dep-service-number');
    } catch(e) {
      fakeDepServiceArrayReturned = false;
    }

    expect(fakeDepServiceNumberReturned).toBeFalsy();
  });

  it('should not register an object as a service', function() {
    var fakeDepServiceObjectReturned = false;

    try {
      module
        .service('fakeDepServiceObject', fakes.fakeDepObject)
        .route('/fake-dep-service-object', function(fakeDepServiceObject) {
          fakeDepServiceObjectReturned = fakeDepServiceObject === fakes.fakeDepObject;
        })
        .goTo('/fake-dep-service-object');
    } catch(e) {
      fakeDepServiceArrayReturned = false;
    }

    expect(fakeDepServiceObjectReturned).toBeFalsy();
  });

  it('should register a function as a service', function() {
    var fakeDepServiceFunctionReturned = false;

    try {
      module
        .service('fakeDepServiceFunction', fakes.fakeDepFunction)
        .route('/fake-dep-service-function', function(fakeDepServiceFunction) {
          fakeDepServiceFunctionReturned = fakeDepServiceFunction === noop;
        })
        .goTo('/fake-dep-service-function');
    } catch(e) {
      fakeDepServiceArrayReturned = false;
    }

    expect(fakeDepServiceFunctionReturned).toBeTruthy();
  });

  it('should only instantiate a service once', function() {
    var fakeDepServiceFunctionCalled = 0;

    module
      .service('fakeDepServiceFunction', function() {
        fakeDepServiceFunctionCalled++;
      })

      .route('/fake-service-counter', function(fakeDepServiceFunction) {})
      .goTo('/fake-service-counter')

      .route('/fake-service-counter-check-again', function(fakeDepServiceFunction) {})
      .goTo('/fake-service-counter-check-again')

      .route('/fake-service-counter-check-one-more-time', function(fakeDepServiceFunction) {})
      .goTo('/fake-service-counter-check-one-more-time');

    expect(fakeDepServiceFunctionCalled).toEqual(1);
  });
});
