// When a route is invoked, this is called to resolve what element matches
// the corresponding route. It is stored on the route's object itself, for
// later usage.
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

// When a route is invoked, this will return the data element that matches
// the route being invoked.
var getElForRoute = function(module, route) {
  return module.route[route].__datael;
};
