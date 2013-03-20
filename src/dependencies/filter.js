/**
 * When we're in the process of launching a new route, we'll need to manage a
 * lot of dependencies. Some have conditions which must be met before being
 * invoked. Others need to keep track of their "active" or "invoked" state and
 * subsequently re-registered.
 *
 * @param  {object}    module The module where our route's dependencies will be
 *                            matched.
 * @param  {string}    route  The name of the route we are going to launch.
 * @return {undefined}
 */
var prepareInvokingFilter = function(module) {
  // `preInstantiation` functions are passed the name and current value of the
  // dependency being requested. All functions must return a value that will
  // represent the dependency for the duration of the invokation.
  var preInstantiation = {
    /**
     * Boot functions typically don't requre filtering. However, should we need
     * to, we have the option.
     *
     * @this   {object} The name and value of the route being requested.
     * @return {*}      The value of the dependency being requested.
     */
    boot: function() {
      return this.value;
    },

    /**
     * If a route is being requested, we need to be sure it's the route we're
     * trying to launch, and not another route listed as a dependency.
     *
     * @this   {object} The name and value of the route being requested.
     * @return {*}      The value of the dependency being requested.
     */
    route: function() {
      if (this.name !== getModuleProperty(module, 'incomingRoute'))
        // If a route isn't yet active, someone is asking for a route. Bust 'em!
        this.value = 'Routes cannot be dependencies, sorry!';

      return this.value;
    },

    /**
     * A service is being requested as a dependency.
     *
     * @this   {object} The name and value of the service being requested.
     * @return {*}      The value of the dependency being requested.
     */
    service: function() {
      return this.value;
    },

    /**
     * A thing is being requested as a dependency.
     *
     * @this   {object} The name and value of the thing being requested.
     * @return {*}      The value of the dependency being requested.
     */
    thing: function() {
      if (this.name === '$el'
        && getModuleProperty(module, 'requestingType') === 'route'
        && getModuleProperty(module, 'incomingRoute') !== getModuleProperty(module, 'activeRoute'))
        this.value = getElForRoute(module, getModuleProperty(module, 'incomingRoute'));

      return this.value;
    }
  };

  // `postInstantiation` functions are passed the name and current value of the
  // dependency being requested. All functions must return a value that will
  // represent the dependency for the duration of the invokation.
  var postInstantiation = {
    /**
     * A boot is being requested as a dependency.
     *
     * @param  {*} value The value of the route being requested.
     * @return {*}       The value of the dependency being requested.
     */
    boot: function(value) {
      return value;
    },

    /**
     * A route is being requested as a dependency.
     *
     * @param  {*} value The value of the route being requested.
     * @return {*}       The value of the dependency being requested.
     */
    route: function(value) {
      return value;
    },

    /**
     * A service is being requested as a dependency.
     *
     * @param  {*} value The value of the service being requested.
     * @return {*}       The value of the dependency being requested.
     */
    service: function(value) {
      // Update the dependency in the module to store its returned value.
      registerDependency(module, 'service', this.name, value);

      // Switch the `invoked` property to true, so that we don't instantiate
      // it again later.
      setProperty(module, 'service', this.name, 'invoked', true);

      return value;
    },

    /**
     * A thing is being requested as a dependency.
     *
     * @param  {*} value The value of the thing being requested.
     * @return {*}       The value of the dependency being requested.
     */
    thing: function(value) {
      return value;
    }
  };

  /**
   * `invokingFilter` is stored on the module, and used during
   * `invokeDependency` to lint or process a dependency before instantiation and
   * after.
   *
   * @param  {string} name The name of the dependency being requested.
   * @param  {string} type The type of dependency being requested.
   * @return {object}      The pre and postInstantiation methods to process
   *                       the dependency injection before and after
   *                       instantiation.
   */
  setModuleProperty(module, 'invokingFilter', function(name, type) {
    var data = {
      name: name,
      value: requestDependency(module, name, type).dependency
    };

    return {
      preInstantiation: preInstantiation[type].bind(data),
      postInstantiation: postInstantiation[type].bind(data)
    };
  });
};
