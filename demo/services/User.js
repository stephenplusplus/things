things('myApp').service('User', function(Store) {
  var loggedIn = !!Store.getItem('User');

  var isLoggedIn = function() {
    return loggedIn;
  };

  var logIn = function(username) {
    Store.setItem('User', username);

    loggedIn = true;
  };

  var logOut = function() {
    Store.removeItem('User');

    loggedIn = false;
  };

  return {
    isLoggedIn: isLoggedIn,
    logIn: logIn,
    logOut: logOut
  };
});
