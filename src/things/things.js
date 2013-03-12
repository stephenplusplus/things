/**
 * The public API to create a new thing module and register other things.
 *
 * @param  {string} moduleName The name of the thing module being requested.
 * @return {object}            The api to interact with the thing module.
 */
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

  /**
   * Returns a function bound to the correct dependency type.
   *
   * @param  {string} type What kind of dependency are we going to eventually
   *                       register?
   * @return {function}    The returned function will call registerDependency.
   */
  var createDependency = function(type) {
    /**
     * The function that is returned which will call registerDependency.
     *
     * @param  {string} name  The name of the thing being registered.
     * @param  {*}      value What is the value of this thing?
     * @return {undefined}
     */
    return function(name, value) {
      registerDependency(module, type, name, value);
    }
  };

  /**
   * What is used to "go to" a route.
   *
   * @param  {string} route  Name of the route we're invoking.
   * @return {object} module The object used for interacting with the module.
   */
  var goTo = function(route) {
    findRouteElements(module, route);
    invokeDependency(module, route, 'route');

    return module;
  };

  /**
   * Registers functions that intend to be invoked after the DOM is ready.
   *
   * @param  {function}         value  The function that will execute.
   * @return {object|undefined} module The object used for interacting with the
   *                                   module.
   */
  var boots = function(value) {
    if (!isFunction(value))
        return;

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

  /**
   * When the DOM has loaded, we can call our `module.boots()` functions
   * one-by-one.
   *
   * @return {undefined}
   */
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
