// ### To see this thing in action, check out [this demo](demo/index.html)!

(function() {
  // ### A thing of things.
  // Create a "bucket" for all of your "things" by calling:
  //
  //     things('nameOfYourApp')
  var app = things('myApp');

  // # Services.
  // A `service` is a once-instantiated, injectable dependency.

  // ### Service: User
  // `User` is a service that will handle the functionality of logging a user
  // in and out. Note that it lists `Store` in the signature of the function.
  // This will be caught by `things` and injected into the function when it is
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

    // We are returning an object literal, limiting access to the above inner-
    // workings. Remember this style when we get to the upcoming `Store`
    // service.
    return {
      isLoggedIn: isLoggedIn,
      logIn: logIn,
      logOut: logOut
    };
  });

  // ### Service: Store
  // `Store` is a localStorage-y bucket that you can drop things in for the life
  // of the session.
  app.service('Store', function(Feature) {
    if (Feature.localStorage) {
      return Feature.localStorage;
    }

    // Note that inside of this `service`, we're making use of `this`. Any
    // `service` function you create will be `new`'d, to cater to your
    // preferred style of writing.
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

  // ### Service: Feature
  // Let's add one more `service`, called `Feature`. This can be used to do a
  // quick check for what features the user's browser and device support.
  app.service('Feature', function(root) {
    this.localStorage = root.localStorage;
  });

  // # Things.
  // When what you want to create isn't a `service`, or a `route`, you might be
  // best off creating a `thing`. These can be functions, arrays, numbers, etc.

  // ### Thing: States
  // This `thing` called `States` will just return an array when summoned by
  // a function.
  app.thing('States', [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ]);

  // # Routes.
  //
  // A `route` is like a "page" of your app. The function in here is called
  // when you or your user asks to `goTo` it.

  // ### Route: /
  // The first parameter to a `route` is the "path" to your app. This route
  // will be our homepage.
  app.route('/', function(User, eL) {
    // We're asking for `User` and `eL`. Remember that `User` is the `service`
    // we created earlier. `eL` is something new.
    //
    // Each `route` should also match an element in your HTML markup. These
    // routes are identified by a custom, `[data-route]` data attribute.
    //
    // For this route, this is what you'll find in `index.html`:
    //
    //     <section data-route="/"></section>
    //
    // So, what `eL` gives us, is access to that DOM element, wrapped with some
    // extra functionality. We use that here to update the innerHTML of the
    // above element.
    if (!User.isLoggedIn()) {
      eL.html('Ha! You\'re not logged in.');
    }
  });

  // ### Route: /login
  // This `/login` route will be called later to simulate logging a user in.
  // The `/login` element from index.html looks like this:
  //
  //     <section data-route="/login">
  //       <form>
  //         <input placeholder="username, please.">
  //         <button>Submit</button>
  //       </form>
  //       <div data-eL></div>
  //     </section>
  //
  // We've added something new here. You can create an element with a `data-eL`
  // data attribute, and in turn, this is what will be injected when asked for
  // `eL`.
  app.route('/login', function(User, eL) {
    User.logIn('stephen');

    if (User.isLoggedIn()) {
      eL.html('Thanks for logging in! You\'ll be re-directed momentarily.');
    }
  });

  // ### Route: /logout
  // `/logout` will simulate logging our user out. It also makes use of a new
  // `goTo` function.
  //
  // `goTo` is provided by `things` out of the box. It is what you will use to
  // move your user around throughout your app.
  app.route('/logout', function(User, goTo) {
    User.logOut();

    if (!User.isLoggedIn()) {
      goTo('/');
    }
  });

  // ### Route: /usa
  // `/usa` is probably the most useful page ever created. We will request that
  // `States` `thing` we created earlier (an array), and turn it into a lovely
  // paragraph.
  app.route('/usa', function(eL, States) {
    eL.html(States.join(', '));
  });

  // # Boots.
  //
  // Pass a function to `boots` that will execute when the document has finished
  // loading. Note that we're asking for `root` here, which is another default
  // dependency provided by `things`, that refers to the global, `window`
  // object.
  app.boots(function(root, goTo) {
    goTo('/logout');
    goTo('/');

    root.setTimeout(function() {
      goTo('/login');
    }, 2000);

    root.setTimeout(function() {
      goTo('/usa');
    }, 4000);
  });
})();
