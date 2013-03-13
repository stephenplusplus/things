things('myApp').route('/', function(User, $el) {
  if (!User.isLoggedIn()) {
    $el.html('Ha! You\'re not logged in.');
  }
});
