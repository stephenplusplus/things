describe('things', function() {
  it('should define things function on window scope', function() {
    expect(typeof things).toEqual('function');
  });

  describe('module name data types', function() {
    var bombed;

    beforeEach(function() {
      bombed = false;
    });

    afterEach(function() {
      bombed = false;
    });

    it('should throw an error if no module name is specified', function() {
      try {
        things().route('/', function() {});
      } catch(e) {
        bombed = true;
      }

      expect(bombed).toBeTruthy();
    });

    it('should create a module if a module name is given a a string', function() {
      try {
        things('fakeThing').route('/', function() {});
      } catch(e) {
        bombed = true;
      }

      expect(bombed).toBeFalsy();
    });

    it('should create a module if a module name is given as a number', function() {
      try {
        things(3).route('/', function() {});
      } catch(e) {
        bombed = true;
      }

      expect(bombed).toBeFalsy();
    });

    it('should throw an error if a module name is given as an object', function() {
      try {
        things({oh: 'no', you: 'dont'}).route('/', function() {});
      } catch(e) {
        bombed = true;
      }

      expect(bombed).toBeTruthy();
    });

    it('should throw an error if a module name is given as an array', function() {
      try {
        things(['no', 'way', 'bro']).route('/', function() {});
      } catch(e) {
        bombed = true;
      }

      expect(bombed).toBeTruthy();
    });
  });

  it('should expose correct API', function() {
    expect(typeof module.route).toEqual('function');
    expect(typeof module.service).toEqual('function');
    expect(typeof module.thing).toEqual('function');
    expect(typeof module.boots).toEqual('function');
    expect(typeof module.goTo).toEqual('function');
  });
});
