var _ = require("underscore");
var MongoClient = require("mongodb").MongoClient;

/**
 * write data to mongodb
 * 
 * @param {MongoClient} mongodb MongoClient instance
 * @param {String} dbName db name to which to write data
 * @param {String} collName collection name to which to write data
 * @param {Object | Array} data data to write to mongodb
 */
var writeToDB = function (mongodb, dbName, collName, data) {
    if (!mongodb instanceof MongoClient) {
        console.log("Error: mongodb must be a MongoClient instance");
        return;
    }

    if (!_.isObject(data) || _.isEmpty(data)) {
        return;
    }

    if (!_.isArray(data)) {
        mongodb.db(dbName).collection(collName).insertOne(data);
    } else {
        mongodb.db(dbName).collection(collName).insertMany(data);
    }
};

module.exports = writeToDB;
