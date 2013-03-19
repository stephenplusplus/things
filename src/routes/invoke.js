/**
 * When we "goTo" a route, we retrieve and execute (if necessary) the
 * dependencies of the route, as well as the dependencies of its dependencies,
 * and so on and so forth.
 *
 * @param  {object}    module The module containing the dependencies.
 * @param  {string}    route  The name of the route we are about to `goTo`.
 * @return {undefined}
 */
var invokeRoute = function(module, route) {
  // We are firing up a route, so let's store its name on our module.
  module.__incomingRoute = route;

  // We begin the search for dependencies!
  module.__requestingType = 'route';
  invokeDependency(module, route, 'route');

  // If we've made it here, we have switched from a previous route successfully.
  // We will update the `__activeRoute` property on the module.
  module.__activeRoute = route;
};
