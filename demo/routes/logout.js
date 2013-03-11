things('myApp').route('/logout', function(User, goTo) {
  User.logOut();

  if (!User.isLoggedIn()) {
    goTo('/');
  }
})
