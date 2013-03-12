// The public API to create a new thing module and register other things.
var things = function(moduleName) {

  // `thingApi` is what will be returned to the user when a thing module is
  // created / asked for.
  var thingApi = allOfTheThingsApis[moduleName];

  // If `thingApi` is defined, that means the user has already registered
  // a module by this name, so we will return that module to them. This is
  // what allows for no variables to be created. Modules can come from
  // `things` directly, exposing all necessary APIs.
  if (isDefined(thingApi))
    return thingApi;

  // If this is a new module, we'll register it with the private object,
  // `allOfTheThings`. It's also referenced as `module` locally, as we will
  // be passing this module directly to all dependency register and
  // invocation functions.
  var module = allOfTheThings[moduleName] = {
    __incomingRoute: null,
    __activeRoute: null,
    route: {},
    service: {},
    thing: {},
    boot: {}
  };

  // This function returns a function bound to the correct dependency type.
  var createDependency = function(type) {
    return function(name, value) {
      registerDependency(module, type, name, value);
    }
  };

  // `goTo` is what is used to "go to" a route. First, we must find the
  // route's elements, then we can invoke the route function.
  var goTo = function(route) {
    findRouteElements(module, route);
    invokeDependency(module, route, 'route');

    return module;
  };

  // `boots` registers functions that intend to be invoked after the DOM has
  // finished loading.
  var boots = function(value) {
    registerDependency(module, 'boot', value.toString().substr(10, 30).replace(/[^\w]|\s/g, ''), value);

    return module;
  };

  // The default `root` dependency, which is just a refence to `window`.
  registerDependency(module, 'thing', 'root', window);

  // Another default `goTo` function, which just returns the `goTo`
  // function defined above.
  registerDependency(module, 'service', 'goTo', function() {
    return goTo;
  });

  // The default `eL` dependency, the jQuery-esque API for the DOM.
  registerDependency(module, 'thing', 'eL', eL);

  // When the DOM has loaded, we can call our `module.boots()` functions
  // one-by-one.
  root.onload = function() {
    for (var bootFn in module.boot)
      if (module.boot.hasOwnProperty(bootFn))
        invokeDependency(module, bootFn, 'boot');
  };

  // We return the public API for registering things, as well as store a
  // reference to it in `allOfTheThingsApis`.
  return allOfTheThingsApis[moduleName] = {
    route: createDependency('route'),
    service: createDependency('service'),
    thing: createDependency('thing'),
    goTo: goTo,
    boots: boots
  };
};

return things;
