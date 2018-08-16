var _ = require("underscore");
var Web3 = require("web3");
var MongoClient = require("mongodb").MongoClient;
var utils = require("./utils.js");
var handler = require("./handler.js");


var checkArgs = function () {
    args = Array.prototype.slice.call(arguments);
    if (args.length != 3) {
        console.log("Error: the arg count of watch is not correct");
        return false;
    }

    if (!args[0] instanceof Web3) {
        console.log("Error: the first arg of watch is not an instance of the Web3 object");
        return false;
    }

    if (!args[1] instanceof MongoClient) {
        console.log("Error: the second arg of watch is not an instance of the MongoClient object");
        return false;
    }

    if (!_.isObject(args[2])) {
        console.log("Error: the third arg of watch should be an object");
        return false;
    }

    return true;
};

var handleOptions = function (options) {
    options = options || {};

    type = options.type;
    delete options.type;

    if (!type) {
        console.log("Error: watch options must contain 'type' field");
        return {};
    }

    if (!type in ["newBlockHeaders", "logs", "pendingTransactions", "syncing"]) {
        console.log("Error: watch type is incorrect");
        return {};
    }

    if (type !== "logs") {
        options = { type: type };
    } else {
        options = { type: type, args: options }
        if (!handleTopics(options.args.topics)) {
            return {};
        }
    }

    return options;
};

var handleTopics = function (topics) {
    if (topics) {
        if (_.isArray(topics)) {
            topics = topics.map(function (topic) {
                return topic.indexOf("0x") == 0 ? topic : "0x" + utils.padZero(topic, 64);
            })
            return true;
        } else {
            console.log("Error: watch topics must be an array")
            return false;
        }
    }

    return true;
};

var watch = function (web3, mongodb, options) {
    if (!checkArgs(web3, mongodb, options)) {
        return;
    }

    options = handleOptions(options);
    if (_.isEmpty(options)) {
        return;
    }

    var callback = function (err, data, subscription) {
        if (!err) {
            handler(web3, mongodb, data, subscription);
        } else {
            console.log(err.stack);
        }
    };

    if (options.type === "logs") {
        web3.eth.subscribe(options.type, options.args, callback);
    } else {
        web3.eth.subscribe(options.type, callback);
    }
};

module.exports = watch;