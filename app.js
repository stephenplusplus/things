// Create a module for the application.
var app = things('taptap');

// A "Service" is a once-instantiated, injectable dependency your app may need.

// "User" is a service that will handle the functionality of logging in and out
// a user. Note that it lists "Store" in the signature of the function. This
// will be caught by "thing.js" and injected into the function when it is
// called.
app.service('User', function(Store) {
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

// "Store" is a localStorage-y bucket that you can drop things in for the life
// of the session.
app.service('Store', function(Feature) {
  if (Feature.localStorage) {
    return Feature.localStorage;
  }

  var Store = {};

  this.setItem = function(name, value) {
    Store[name] = value;
  };

  this.getItem = function(name) {
    return Store[name];
  };

  this.removeItem = function(name) {
    delete Store[name];
  };
});

// We'll see what features we support.
app.service('Feature', function(root) {
  this.touch = false; // Modernizr.touch?

  this.localStorage = root.localStorage;
});

// You can also declare a "thing". A function, an array, anything.
app.thing('root', window);

app.thing('$', function() {
  var forEach = Array.prototype.forEach;

  var matches = [];

  var api = {
    html: function(newString) {
      forEach.call(matches, function(match) {
        match.innerHTML = newString;
      });
    }
  };

  return function(str) {
    matches = document.querySelectorAll(str);

    return api;
  }
});

app.service('goTo', function() {
  return app.goTo;
});

app.thing('States', [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
]);

// A "route" is like a "page" of your app.
app.route('/', function(User, goTo, $) {
  if (User.isLoggedIn())
    goTo('/usa');
  else
    $('body').html('Ha! You\'re not logged in.');
});

app.route('/login', function(root, User, goTo, $) {
  User.logIn('stephen');

  if (User.isLoggedIn()) {
    $('body').html('Hey! Thanks for logging in, Stephen! You\'ll be re-directed momentarily.');
  }
});

app.route('/logout', function(User, goTo) {
  User.logOut();

  if (!User.isLoggedIn()) {
    goTo('/');
  }
});

app.route('/usa', function($, States) {
  $('body').html(States.join(', '));
});

app.boots(function(root, goTo) {
  goTo('/');

  root.setTimeout(function() {
    goTo('/login');
  }, 2000);

  root.setTimeout(function() {
    goTo('/');
  }, 4000);

  root.setTimeout(function() {
    goTo('/logout');
  }, 6000);
});