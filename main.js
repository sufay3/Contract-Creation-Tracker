var App = require("./app.js");
var utils = require("./utils.js");

// app options
var appOptions = {
    wsUrl: "ws://localhost:8546",
    mongoUrl: "mongodb://localhost:27017"
};

var watchOptions = {
    "type": "newBlockHeaders",
};

// define entry function
var main = function (appOptions, watchOptions) {
    let app = new App(appOptions);

    app.init().then(initialized => {
        if (initialized) {
            app.start(watchOptions);
        }
    });
};

// start app
main(appOptions, watchOptions);
