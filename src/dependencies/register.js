// This is the function behind all public APIs that allow type registration.
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
