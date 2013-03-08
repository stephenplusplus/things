(function(root) {
  var is = function (thing, type) { return typeof thing === type; }
    , isDefined = function(thing) { return !isUndefined(thing); }
    , isUndefined = function(thing) { return is(thing, 'undefined'); }
    , isFunction = function(thing) { return is(thing, 'function'); }
    , isString = function(thing) { return is(thing, 'string'); };

  root.things = (function() {
    var allOfTheThings = {}
      , dependencyTypes = ['route', 'service', 'thing'];

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
        , service = type === 'service'
        , invoked = service && value.__invoked;

      theInvoking: {
        if (isFunction(value)) {
          if (invoked)
            break theInvoking;

          value = new value(
            invokeDependency(module, dependencies[0], requestDependency(module, dependencies[0]).dependencyType),
            invokeDependency(module, dependencies[1], requestDependency(module, dependencies[1]).dependencyType),
            invokeDependency(module, dependencies[2], requestDependency(module, dependencies[2]).dependencyType),
            invokeDependency(module, dependencies[3], requestDependency(module, dependencies[3]).dependencyType),
            invokeDependency(module, dependencies[4], requestDependency(module, dependencies[4]).dependencyType)
          );

          if (service) {
            registerDependency(module, 'service', name, value);
            module.service[name].__invoked = true;
          }
        }
      }

      return value;
    };

    var things = function(module) {
      module = allOfTheThings[module] = {
        route: {},
        service: {},
        thing: {},
        boot: {}
      };

      var route = function(route, value) {
        registerDependency(module, 'route', route, value);

        return module;
      };

      var service = function(service, value) {
        registerDependency(module, 'service', service, value);

        return module;
      };

      var thing = function(thing, value) {
        registerDependency(module, 'thing', thing, value);

        return module;
      };

      var goTo = function(route) {
        invokeDependency(module, route, 'route');

        return module;
      };

      var boots = function(value) {
        registerDependency(module, 'boot', value.toString().substr(10, 30).replace(/^\w|\s/g, ''), value);

        return module;
      };

      root.onload = function() {
        for (var bootFn in module.boot)
          if (module.boot.hasOwnProperty(bootFn))
            invokeDependency(module, bootFn, 'boot');
      };

      return {
        route: route,
        service: service,
        thing: thing,
        goTo: goTo,
        boots: boots
      };
    };

    return things;
  })();
})(window);