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
