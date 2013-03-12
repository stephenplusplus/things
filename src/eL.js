// `eL` is the internal jQuery-esque API to interact with the DOM element
// matching the route.
var eL = (function() {
  var forEach = Array.prototype.forEach;

  var find = function(context) {
    if (isUndefined(context))
      return;

    return root.jQuery
      ? root.jQuery(context).find.bind(root.jQuery(context))
      : context.querySelectorAll.bind(context);
  };

  return function() {
    var api = {
      matches: null,

      find: function(element) {
        var context = find(api.matches[0])
          , matched;

        if (isFunction(context))
          matched = context(element);

        if (isDefined(matched) && isDefined(matched[0]))
          api.matches = matched;

        return api;
      },

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
