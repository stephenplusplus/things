if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof function() {} && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

// good ol' noop.
noop = function() {};

// thing holders!
module = things('module');

// fake dependencies.
fakes = {
  fakeDepArray: [1, 2, 3],
  fakeDepNumber: 1,
  fakeDepObject: { objects: 'work!' },
  fakeDepFunction: function() { return noop; },
  fakeDepService: function() { return noop; }
};
