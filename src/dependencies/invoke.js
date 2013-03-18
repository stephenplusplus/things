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
  value = requestDependency(module, name, type).dependency,

  // Did we find a dependency? Let's see if it has any dependencies of its
  // own.
  dependencies = value? module[type][name].__dependencies : [],

  // Are we trying to fire up a route?
  route = type === 'route',
  // Are we switching routes?
  routeIsSwitching = module.__incomingRoute !== module.__activeRoute,

  // Is it a service? ...
  service = type === 'service',
  // ... and if so, has it been invoked?
  invoked = service && module.service[name].__invoked,

  // Ok, we're asking for a thing.
  thing = type === 'thing';

  if (route) {
    if (routeIsSwitching)
      // If a route isn't yet active, we can't inject a route.
      return 'Routes cannot be dependencies, sorry!';

    // We are firing up a route, so let's store its name on our module.
    module.__incomingRoute = name;
  }

  // We're asking for `$$` and we're switching routes. We'll set the value to
  // the correct `$$` element that matches the incoming route.
  if (route && name === '$el')
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
