/**
 * Let's invoke a dependency!
 *
 * @param  {object} module The module containing the dependencies.
 * @param  {string} name   The dependency we are trying to receive.
 * @param  {string} type   The type of dependency we want.
 * @return {*}      value  The value of the dependency can be anything!
 */
var invokeDependency = function(module, name, type) {
  if (isUndefined(name) || isUndefined(type))
    return undefined;

  var
  // Wire up our invokingFilter, used throughout the life of this function.
  filter = getModuleProperty(module, 'invokingFilter')(name, type),

  // Sniff out any dependencies this dependency may have.
  dependencies = getProperty(module, type, name, 'dependencies');

  // Using our `invokingFilter`, we get our initial value of the dependency.
  var value = filter.preInstantiation();

  if (isArray(dependencies))
    // Update the `requestingType` to store the dependency asking for the next
    // dependencies.
    setModuleProperty(module, 'requestingType', type);

  if (isFunction(value) && !getProperty(module, type, name, 'invoked'))
    // If the value is a function, but not a service that's been invoked, this
    // will take the first 10 dependencies listed and pass them into a `new`'d
    // value().
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

  // The value of the dependency might stay the same as it is currently in the
  // invokation, or it might need some additional processing. We'll run it
  // through the filter one last time to determine its final value, then return
  // that value.
  return filter.postInstantiation(value);
};
