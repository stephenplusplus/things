/**
 * When a route is invoked, this resolves what element matches the corresponding
 * route. It is stored on the route's object for later usage.
 *
 * @param  {object} module The module that contains the route.
 * @param  {string} route  The name of the route we are working with.
 * @return {undefined}
 */
var findRouteElements = function(module, route) {
  // We will use our internal `$$` to locate the matching elements.
  var dataroute = $$('[data-route="'+ route +'"]')
    , datael = dataroute.find('[data-el]');

  module.route[route].__dataroute = dataroute;

  module.route[route].__datael =
    isDefined(datael[0])
      ? datael
      : dataroute;
};

/**
 * When a route is invoked, return the matching element.
 *
 * @param  {object} module The module that contains the route.
 * @param  {string} route  The route we are going to look for the element on.
 * @return {$$}
 */
var getElForRoute = function(module, route) {
  findRouteElements(module, route);

  return module.route[route].__datael;
};
