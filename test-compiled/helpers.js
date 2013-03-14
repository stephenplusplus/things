// good ol' noop.
var noop = function() {};

// thing holders!
var things = window.things
  , module;

// fake dependencies.
var fakes = {
  fakeDepArray: [1, 2, 3],
  fakeDepNumber: 1,
  fakeDepObject: { objects: 'work!' },
  fakeDepFunction: function() { return noop; },
  fakeDepService: function() { return noop; }
};
