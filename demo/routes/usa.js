things('myApp').route('/usa', function(eL, States) {
  eL.html(States.join(', '));
});
