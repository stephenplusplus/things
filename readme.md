## things

If you want to have some control over your JavaScript, give `things` a shot!

The idea is, modularize your code. Not just file dependencies, but function/array/string/THINGS! as well.

This is a very rough draft of what is just a hobby project. There is a lot of room for improvement, so feel free to suggest features that are missing, or contribute some of your ideas!

Here's some sample code, to get you going.

```javascript
  // Create a bucket for your things!
  var myApp = things('app');

  // Figure out what you use throughout your app.
  // For example, maybe you share a common, once-instantiated
  // function throughout multiple functions. No more chucking
  // things on the global scope, and hoping they exist.
	//
  // Try creating a service:
  myApp.service('User', function() {
    var User = {
      id: 1,
			name: 'Stephen'
    };

    return {
      getUser: function() {
        return User;
			}
    };
  });

	// Now let's try creating a "page", also known as a `route`.
  myApp.route('/', function(User) {
		var userName = User.getUser().name;
	});

	// Because we added `User` into the function signature,
  // when we navigate to that `route`, `things` will hand
	// you the `thing` you registered by the same name.

	// `things` can be a `service`, `route`, or for everything
	// else, just a `thing`.

	// To trigger the `route` we created, we just tell things
  // to `goTo` it:
	myApp.goTo('/route');
```

For a more elaborate example, check out `app.'s` in this repo.
