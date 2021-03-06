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
  if (type === 'service'
    && !isFunction(value)
    && isUndefined(getProperty(module, 'service', name, 'invoked')))
    // If the dependency is a service that has not yet been invoked, we're more
    // picky about what the service type can be.
    throw new Error('Services must be functions!');

  var dependency = module[type][name] = value;

  // Create a hidden store for internal data related to this dependency.
  module[type]['__' + name] = {};

  // If the dependency is a function, we strip out the dependencies listed in
  // it's signature.
  if (isFunction(value)) {
    var dependencies = value.toString().match(/^\s*function\s*\((.*?)\)/);

    setProperty(module, type, name, 'dependencies',
      dependencies && dependencies[1] !== ''
        ? dependencies[1].replace(/\s/g, '').split(',')
        : []);
  }

  if (type === 'service' && isUndefined(getProperty(module, 'service', name, 'invoked')))
    // If the dependency is a service, we will specifiy that it has not yet
    // been invoked.
    setProperty(module, type, name, 'invoked', false);
};
