var
/**
 * Checks if a given "thing" is of a certain "type".
 *
 * @param  {*}      thing The thing you're curious about.
 * @param  {string} type  The type you're matching the thing against.
 * @return {boolean}
 */
is = function (thing, type) {
    return typeof thing === type;
}

/**
 * Is this thing defined?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
, isDefined = function(thing) {
    return !isUndefined(thing);
}

/**
 * Is this thing undefined?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
, isUndefined = function(thing) {
    return is(thing, 'undefined');
}

/**
 * Is this thing a function?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
, isFunction = function(thing) {
    return is(thing, 'function');
}

/**
 * Is this thing a string?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
, isString = function(thing) {
    return is(thing, 'string');
}

/**
 * Is this thing an array?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
, isArray = function(thing) {
    return is(thing, 'object') && isDefined(thing.length);
};


