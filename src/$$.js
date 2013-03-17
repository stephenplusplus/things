/**
 * Internal jQuery/jQuery-esque API to interact with the DOM.
 *
 * @return {function} Immediately executed to privatize common functions.
 */
var $$ = (function($) {
  var jQueryPresent = isFunction($);

  // Let's save this, so we can loop over matches.
  var forEach = Array.prototype.forEach;

  /**
   * Private find method, which uses jQuery if available.
   *
   * @param  {HTMLElement|string} context The context to search within.
   * @return {function|undefined}         The bound find function.
   */
  var finder = function(context) {
    if (isDefined(context))
      return context.querySelectorAll.bind(context);
  };

  /**
   * Returns the jQuery-esque API, used internally and exposed as a default
   * dependency.
   *
   * @param  {string} arguments[0]
   * @return {object}
   */
  return function() {
    var api = {
      matches: null,

      /**
       * Looks within the matched DOM element for another element.
       *
       * @param  {string} element A DOM search parameter.
       * @return {object} api     The $$ api is returned to allow chaining.
       */
      find: function(element) {
        var context = finder(api.matches[0])
          , matched;

        if (isFunction(context))
          matched = context(element);

        if (isDefined(matched) && isDefined(matched[0]))
          api.matches = matched;

        return api;
      },

      /**
       * This function will update or return the innerHTML of an element.
       *
       * @param  {*|undefined} newContent A DOM search parameter.
       * @return {string|undefined}
       */
      html: function(newContent) {
        if (isUndefined(newContent))
          return api.matches[0].innerHTML;

        if (!isFunction(newContent) && !isArray(newContent))
          forEach.call(api.matches, function(match) {
            return match.innerHTML = newContent;
          });
      }
    };

    if (jQueryPresent)
      // We have jQuery, so we will use that, straight up!
      return $(arguments[0]);

    // jQuery isn't around, so we'll have to use our fallback.
    api.matches = finder(root.document)(arguments[0]);
    return api;
  }
})(root.jQuery);
