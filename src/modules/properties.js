/**
 * Sets a property on the internal, hidden data store for the matching thing.
 *
 * @param  {object}    module
 * @param  {string}    type
 * @param  {string}    thing
 * @param  {string}    name
 * @param  {*}         value
 * @return {undefined}
 */
var setProperty = function(module, type, thing, name, value) {
  if (type === 'module')
    module['__' + name] = value;
  else
    module[type]['__' + thing][name] = value;
};

/**
 * Returns a property on the internal, hidden data store for the matching thing.
 *
 * @param  {object}    module
 * @param  {string}    type
 * @param  {string}    thing
 * @param  {string}    name
 * @return {*}
 */
var getProperty = function(module, type, thing, name) {
  if (type === 'module')
    return module['__' + name];
  else
    return module[type]['__' + thing][name];
};

/**
 * Sets a property on a module.
 *
 * @param  {object}    module
 * @param  {string}    name
 * @param  {*}         value
 * @return {undefined}
 */
var setModuleProperty = function(module, name, value) {
  setProperty(module, 'module', null, name, value);
};

/**
 * Returns a property from a module.
 *
 * @param  {object}    module
 * @param  {string}    name
 * @return {*}
 */
var getModuleProperty = function(module, name) {
  return getProperty(module, 'module', null, name);
};
