/**
 * The public API to create a new thing module and register other things.
 *
 * @param  {string} moduleName The name of the thing module being requested.
 * @return {object}            The api to interact with the thing module.
 */
var things = function(moduleName) {
  if (isUndefined(moduleName))
    throw new Error('Hey! Name your things!');

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
    __invokingFilter: null,
    __incomingRoute: null,
    __activeRoute: null,
    route: {},
    service: {},
    thing: {},
    boot: {}
  };

  // Prepare the invoking filter to be stored on the module.
  invokingFilter(module);

  // The default `root` dependency, which is just a refence to `window`.
  registerDependency(module, 'thing', 'root', window);

  // Another default `goTo` function, which just returns the `goTo`
  // function defined above.
  registerDependency(module, 'service', 'goTo', function() {
    return goTo;
  });

  // The default `$` dependency, the jQuery-esque API for the DOM.
  registerDependency(module, 'service', '$', function() {
    return $$;
  });

  // For routes, we provide a special `$el` to reference the route's element.
  registerDependency(module, 'thing', '$el', $$);

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

      return allOfTheThingsApis[moduleName];
    }
  };

  /**
   * What is used to "go to" a route.
   *
   * @param  {string} route  Name of the route we're invoking.
   * @return {object} module The object used for interacting with the module.
   */
  var goTo = function(route) {
    invokeRoute(module, route);

    return allOfTheThingsApis[moduleName];
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

    // Create a random name for this boot function.
    var bootName = value.toString().substr(10, 30).replace(/[^\w]|\s/g, '');

    registerDependency(module, 'boot', bootName, value);

    if (isDOMLoaded)
      // If the DOM has already loaded, we'll invoke this immediately.
      invokeDependency(module, bootName, 'boot');

    return allOfTheThingsApis[moduleName];
  };

  /**
   * When the DOM has loaded, we can call our `module.boots()` functions
   * one-by-one.
   *
   * @return {undefined}
   */
  var isDOMLoaded = document.readyState === 'complete';
  root.onload = function() {
    isDOMLoaded = true;

    for (var bootName in module.boot)
      if (module.boot.hasOwnProperty(bootName))
        invokeDependency(module, bootName, 'boot');
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
