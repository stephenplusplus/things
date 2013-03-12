/*!
 * things. it's so thingy.
 * @stephenplusplus
 * github.com/stephenplusplus/things
 */

/**
 * things wrapper.
 *
 * @param  {object} root The global window object.
 * @return {undefined}
 */
(function(root) {
'use strict';

var
/**
 * Checks if a given "thing" is of a certain "type".
 *
 * @param  {*}      thing The thing you're curious about.
 * @param  {string} type  The type you're matching the thing against.
 * @return {boolean}
 */
is = function (thing, type) {
    return typeof thing === type;
}

/**
 * Is this thing defined?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
, isDefined = function(thing) {
    return !isUndefined(thing);
}

/**
 * Is this thing undefined?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
, isUndefined = function(thing) {
    return is(thing, 'undefined');
}

/**
 * Is this thing a function?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
, isFunction = function(thing) {
    return is(thing, 'function');
}

/**
 * Is this thing a string?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
, isString = function(thing) {
    return is(thing, 'string');
};

/**
 * Internal jQuery-esque API to interact with the DOM.
 *
 * @return {function} Immediately executed to privatize common functions.
 */
var eL = (function() {
  var forEach = Array.prototype.forEach;

  /**
   * Private find method, which uses jQuery if available.
   *
   * @param  {HTMLElement|string} context The context to search within.
   * @return {function}                   The bound find function.
   */
  var find = function(context) {
    if (isUndefined(context))
      return;

    return root.jQuery
      ? root.jQuery(context).find.bind(root.jQuery(context))
      : context.querySelectorAll.bind(context);
  };

  /**
   * Returns the jQuery-esque API, used internally and exposed as a default
   * dependency.
   *
   * @param  {string} arguments[0]
   * @return {object} api
   */
  return function() {
    var api = {
      matches: null,

      /**
       * Looks within the matched DOM element for another element.
       *
       * @param  {string} element A DOM search parameter.
       * @return {object} api     The eL api is returned to allow chaining.
       */
      find: function(element) {
        var context = find(api.matches[0])
          , matched;

        if (isFunction(context))
          matched = context(element);

        if (isDefined(matched) && isDefined(matched[0]))
          api.matches = matched;

        return api;
      },

      /**
       * This function will update or return the innerHTML of an element.
       *
       * @param  {string}           newString A DOM search parameter.
       * @return {undefined|string}
       */
      html: function(newString) {
        if (isString(newString))
          forEach.call(api.matches, function(match) {
            if (isString(newString))
              return match.innerHTML = newString;
          });

        if (isUndefined(newString))
          return api.matches[0].innerHTML;
      }
    };

    api.matches = find(root.document.body)(arguments[0]);

    return api;
  }
})();

var
  // These are the different types of dependencies that can be registered.
  dependencyTypes = ['route', 'service', 'thing']

  // `allOfTheThings` holds the things attached to each module that we pass
  // around within the library (routes, services, etc).
  , allOfTheThings = {}

  // `alOfTheThingsApis` holds the public API for the modules.
  , allOfTheThingsApis = {};

/**
 * When a route is invoked, this resolves what element matches the corresponding
 * route. It is stored on the route's object for later usage.
 *
 * @param  {object} module The module that contains the route.
 * @param  {string} route  The name of the route we are working with.
 * @return {undefined}
 */
var findRouteElements = function(module, route) {
  // If we've already found the route's element(s), let's return from this
  // function, as to not search the DOM again, unnecessarily.
  if (isDefined(module.route[route].__datael))
    return;

  // If we haven't already found them, this will use our internal `eL` to
  // locate the matching elements.
  var dataroute = eL('[data-route="'+ route +'"]')
    , datael = dataroute.find('[data-eL]');

  module.route[route].__dataroute = dataroute;
  module.route[route].__datael = datael.matches[0] ? datael : dataroute;
};

/**
 * When a route is invoked, return the matching element.
 *
 * @param  {object} module The module that contains the route.
 * @param  {string} route  The route we are going to look for the element on.
 * @return {eL}
 */
var getElForRoute = function(module, route) {
  return module.route[route].__datael;
};

/**
 * The function behind all public APIs that allows dependency registration.
 *
 * @param  {object} module The module the dependency will be registered on.
 * @param  {string} type   The type of dependency being registered.
 * @param  {string} name   The name of the dependency.
 * @param  {*}      value  The value of the dependency.
 * @return {undefined}
 */
var registerDependency = function(module, type, name, value) {
  var dependency = module[type][name] = value;

  // If the dependency is a function, we strip out the dependencies listed
  // in it's signature.
  if (isFunction(value)) {
    var dependencies = value.toString().match(/^\s*function\s*\((.*?)\)/);

    dependency.__dependencies =
      dependencies && dependencies[1] !== ''
        ? dependencies[1].replace(/\s/g, '').split(',')
        : [];
  }

  // If the dependency is a service, we will specifiy that it has not yet
  // been invoked.
  if (type === 'service')
    dependency.__invoked = false;
};

/**
 * When we need a depency, we start by passing in the module to search in, and
 * then as much information as we have. If all we know is the name, this
 * searches through the various types of dependencies, until a match is found.
 * We can also specify the name AND type of what we want, in which case it is
 * handed right to us.
 *
 * @param  {object}           module The module from where we're searching for
 *                                   the dependency.
 * @param  {string}           name   The name of the dependency we need.
 * @param  {string|undefined} type   The type of dependency we want.
 * @return {object}           returnDependency The dependency and type matched.
 */
var requestDependency = function(module, name, type) {
  var returnDependency = {
    dependencyType: undefined,
    dependency: undefined
  };

  if (!isDefined(name) && !isDefined(type))
    // Nothing provided to us! Abort!
    return returnDependency;

  if (isDefined(name) && isDefined(type))
    // We know exactly what we want.
    returnDependency.dependencyType = type,
    returnDependency.dependency = module[type][name];

  else
    // Let's go digging for it.
    returnDependency.dependency = dependencyTypes.filter(function(depType) {
      if (isDefined(module[depType][name])) {
        returnDependency.dependencyType = depType;
        return module[depType][name];
      }
    })[0];

  if (!returnDependency.dependency || !returnDependency.dependencyType)
    throw new Error(name + ' doesn\'t appear to be a thing.');

  return returnDependency;
};

/**
 * When we "goTo" a route, we retrieve and execute (if necessary) the
 * dependencies of the route, as well as the dependencies of its dependencies,
 * and so on and so forth.
 *
 * @param  {object} module The module containing the dependencies.
 * @param  {string} name   The dependency we are trying to recieve.
 * @param  {string} type   The type of dependency we want.
 * @return {*}      value  The value of the dependency can be anything!
 */
var invokeDependency = function(module, name, type) {
  var
  // Let's start by grabbing the dependency that we're looking for.
  value = requestDependency(module, name, type).dependency

  // Did we find a dependency? Let's see if it has any dependencies of its
  // own.
  , dependencies = value? value.__dependencies : []

  // Are we trying to fire up a route?
  , route = type === 'route'

  // Is it a service? ...
  , service = type === 'service'
  // ... and if so, has it been invoked?
  , invoked = service && value.__invoked

  // Ok, we're asking for a thing.
  , thing = type === 'thing';

  // We are firing up a route, so let's store its name on our module.
  if (route)
    module.__incomingRoute = name;

  // We're asking for `eL` and we're switching routes. We'll set the value
  // to the correct `eL` element that matches the incoming route.
  if (name === 'eL' && module.__incomingRoute !== module.__activeRoute)
    value = getElForRoute(module, module.__incomingRoute);

  // This is where the instantiating of our functions comes in.
  theInvoking: {

    // Is the value being asked for a function?
    if (isFunction(value)) {

      // Is the function being requested a service that has been invoked? If
      // so, we will not re-invoke it, and instead hand it back as-is.
      if (invoked)
        break theInvoking;

      // The value is not a service that's been invoked, but is a function
      // which has its own dependencies. This will take the first 10 listed
      // and pass them into a `new`'d value();
      value = new value(
        invokeDependency(module, dependencies[0], requestDependency(module, dependencies[0]).dependencyType),
        invokeDependency(module, dependencies[1], requestDependency(module, dependencies[1]).dependencyType),
        invokeDependency(module, dependencies[2], requestDependency(module, dependencies[2]).dependencyType),
        invokeDependency(module, dependencies[3], requestDependency(module, dependencies[3]).dependencyType),
        invokeDependency(module, dependencies[4], requestDependency(module, dependencies[4]).dependencyType),
        invokeDependency(module, dependencies[5], requestDependency(module, dependencies[5]).dependencyType),
        invokeDependency(module, dependencies[6], requestDependency(module, dependencies[6]).dependencyType),
        invokeDependency(module, dependencies[7], requestDependency(module, dependencies[7]).dependencyType),
        invokeDependency(module, dependencies[8], requestDependency(module, dependencies[8]).dependencyType),
        invokeDependency(module, dependencies[9], requestDependency(module, dependencies[9]).dependencyType)
      );

      // If the value is a service and we've gotten to here, we will switch
      // the `__invoked` property to true, so that we don't instantiate it
      // again later. We also update the dependency in the module to reflect
      // its returned value.
      if (service) {
        registerDependency(module, 'service', name, value);
        module.service[name].__invoked = true;
      }
    }
  }

  // If the dependency is a route and we've made it here, we have switched
  // from a previous route successfully. We will update the `__activeRoute`
  // property on the module.
  if (route)
    module.__activeRoute = name;

  // The value of the dependency is returned.
  return value;
};

/**
 * We will add things to the global object.
 *
 * @return {function}
 */
root.things = (function() {

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

})();

})(window);