things('myApp').route('/usa', function($el, States) {
  $el.html(States.join(', '));
});
