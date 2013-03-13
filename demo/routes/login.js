things('myApp').route('/login', function(User, $el) {
  User.logIn('stephen');

  if (User.isLoggedIn()) {
    $el.html('Thanks for logging in! You\'ll be re-directed momentarily.');
  }
});
