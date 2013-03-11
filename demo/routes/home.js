things('myApp').route('/', function(User, eL) {
  if (!User.isLoggedIn()) {
    eL.html('Ha! You\'re not logged in.');
  }
});
