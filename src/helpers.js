// Helper functions used throughout the library to check the various types.
var is = function (thing, type) { return typeof thing === type; }
  , isDefined = function(thing) { return !isUndefined(thing); }
  , isUndefined = function(thing) { return is(thing, 'undefined'); }
  , isFunction = function(thing) { return is(thing, 'function'); }
  , isString = function(thing) { return is(thing, 'string'); };
