/**
 * Internal jQuery-esque API to interact with the DOM.
 *
 * @return {function} Immediately executed to privatize common functions.
 */
var eL = (function() {
  var forEach = Array.prototype.forEach;

  /**
   * Private find method, which uses jQuery if available.
   *
   * @param  {HTMLElement|string} context The context to search within.
   * @return {function}                   The bound find function.
   */
  var find = function(context) {
    if (isUndefined(context))
      return;

    return root.jQuery
      ? root.jQuery(context).find.bind(root.jQuery(context))
      : context.querySelectorAll.bind(context);
  };

  /**
   * Returns the jQuery-esque API, used internally and exposed as a default
   * dependency.
   *
   * @param  {string} arguments[0]
   * @return {object} api
   */
  return function() {
    var api = {
      matches: null,

      /**
       * Looks within the matched DOM element for another element.
       *
       * @param  {string} element A DOM search parameter.
       * @return {object} api     The eL api is returned to allow chaining.
       */
      find: function(element) {
        var context = find(api.matches[0])
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
       * @param  {string}           newString A DOM search parameter.
       * @return {undefined|string}
       */
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
