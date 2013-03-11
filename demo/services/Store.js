things('myApp').service('Store', function(Feature) {
  if (Feature.localStorage) {
    return Feature.localStorage;
  }

  var Store = {};

  this.setItem = function(name, value) {
    Store[name] = value;
  };

  this.getItem = function(name) {
    return Store[name];
  };

  this.removeItem = function(name) {
    delete Store[name];
  };
});
