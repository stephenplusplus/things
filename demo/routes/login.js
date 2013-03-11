things('myApp').route('/login', function(User, eL) {
  User.logIn('stephen');

  if (User.isLoggedIn()) {
    eL.html('Thanks for logging in! You\'ll be re-directed momentarily.');
  }
});
