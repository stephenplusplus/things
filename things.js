(function(root) {
  var is = function (thing, type) { return typeof thing === type; }
    , isDefined = function(thing) { return !isUndefined(thing); }
    , isUndefined = function(thing) { return is(thing, 'undefined'); }
    , isFunction = function(thing) { return is(thing, 'function'); }
    , isString = function(thing) { return is(thing, 'string'); };

  var eL = (function() {
    var forEach = Array.prototype.forEach;

    var find = function(context) {
      if (isUndefined(context))
        return;

      return root.jQuery
        ? root.jQuery(context).find.bind(root.jQuery(context))
        : context.querySelectorAll.bind(context);
    };

    return function() {
      var api = {
        matches: null,

        find: function(element) {
          var context = find(api.matches[0])
            , matched;

          if (isFunction(context))
            matched = context(element);

          if (isDefined(matched) && isDefined(matched[0]))
            api.matches = matched;

          return api;
        },

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

  root.things = (function() {
    var allOfTheThings = {}
      , allOfTheThingsApis = {}
      , dependencyTypes = ['route', 'service', 'thing'];

    var getActiveRoute = function(module) {
      return module.__activeRoute;
    };

    var getIncomingRoute = function(module) {
      return module.__incomingRoute;
    };

    var findRouteElements = function(module, route) {
      var dataroute = eL('[data-route="'+ route +'"]')
        , datael = dataroute.find('[data-eL]');

      module.route[route].__dataroute = dataroute;
      module.route[route].__datael = datael.matches[0] ? datael : dataroute;
    };

    var getElForRoute = function(module, route) {
      return module.route[route].__datael;
    };

    var registerDependency = function(module, type, name, value) {
      var dependency = module[type][name] = value;

      if (isFunction(value)) {
        var dependencies = value.toString().match(/^\s*function\s*\((.*?)\)/);

        dependency.__dependencies = dependencies && dependencies[1] !== ''? dependencies[1].replace(/\s/g, '').split(',') : [];
      }

      if (type === 'service')
        dependency.__invoked = false;
    };

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

    var invokeDependency = function(module, name, type) {
      var value = requestDependency(module, name, type).dependency
        , dependencies = value? value.__dependencies : []
        , route = type === 'route'
        , service = type === 'service'
        , invoked = service && value.__invoked
        , thing = type === 'thing';

      if (route)
        module.__incomingRoute = name;

      if (name === 'eL' && module.__incomingRoute !== module.__activeRoute)
        value = getElForRoute(module, module.__incomingRoute);

      theInvoking: {
        if (isFunction(value)) {
          if (invoked)
            break theInvoking;

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

          if (service) {
            registerDependency(module, 'service', name, value);
            module.service[name].__invoked = true;
          }
        }
      }

      if (route)
        module.__activeRoute = name;

      return value;
    };

    var things = function(moduleName) {
      var thingApi = allOfTheThingsApis[moduleName];

      if (isDefined(thingApi))
        return thingApi;

      var module = allOfTheThings[moduleName] = {
        __incomingRoute: null,
        __activeRoute: null,
        route: {},
        service: {},
        thing: {},
        boot: {}
      };

      var createDependency = function(type) {
        return function(name, value) {
          registerDependency(module, type, name, value);
        }
      };

      var goTo = function(route) {
        findRouteElements(module, route);
        invokeDependency(module, route, 'route');

        return module;
      };

      var boots = function(value) {
        registerDependency(module, 'boot', value.toString().substr(10, 30).replace(/^\w|\s/g, ''), value);

        return module;
      };

      // register default dependencies.
      registerDependency(module, 'thing', 'root', window);

      registerDependency(module, 'service', 'goTo', function() {
        return goTo;
      });

      registerDependency(module, 'thing', 'eL', eL);

      root.onload = function() {
        for (var bootFn in module.boot)
          if (module.boot.hasOwnProperty(bootFn))
            invokeDependency(module, bootFn, 'boot');
      };

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
