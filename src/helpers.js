var
// Save a copy of toString to abuse.
__toString = ({}).toString,

/**
 * Checks if a given "thing" is of a certain "type".
 *
 * @param  {*}      thing The thing you're curious about.
 * @param  {string} type  The type you're matching the thing against.
 * @return {boolean}
 */
is = function (thing, type) {
  return typeof thing === type;
},

/**
 * Is this thing defined?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
isDefined = function(thing) {
  return !isUndefined(thing);
},

/**
 * Is this thing undefined?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
isUndefined = function(thing) {
  return is(thing, 'undefined');
},

/**
 * Is this thing a function?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
isFunction = function(thing) {
  return __toString.call(thing) === '[object Function]';
},

/**
 * Is this thing a string?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
isString = function(thing) {
  return __toString.call(thing) === '[object String]';
},

/**
 * Is this thing an array?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
isArray = function(thing) {
  return __toString.call(thing) === '[object Array]';
},

/**
 * Is this thing a number?
 *
 * @param  {*} thing The thing you're curious about.
 * @return {boolean}
 */
isNumber = function(thing) {
  return __toString.call(thing) === '[object Number]';
};
