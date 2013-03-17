var
// These are the different types of dependencies that can be registered.
dependencyTypes = ['route', 'service', 'thing'],

// `allOfTheThings` holds the things attached to each module that we pass
// around within the library (routes, services, etc).
allOfTheThings = {},

// `alOfTheThingsApis` holds the public API for the modules.
allOfTheThingsApis = {};
