things('myApp').boots(function(root, goTo) {
  goTo('/logout');

  goTo('/');

  root.setTimeout(function() {
    goTo('/login');
  }, 2000);

  root.setTimeout(function() {
    goTo('/usa');
  }, 4000);
});
