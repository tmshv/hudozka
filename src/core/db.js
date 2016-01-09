/**
 * Created by tmshv on 22/11/14.
 */

var mongo = require("promised-mongo");
var ObjectId = mongo.ObjectId;

var client = null;

module.exports = {
    init: function (uri) {
        //noinspection JSUnresolvedFunction
        return new Promise(function (resolve) {
            client = mongo(uri);
            resolve();
        });
    },

    get db() {
        return client;
    },

    c: function(name){
        return client.collection(name);
    },

    id: function(i) {
        if(typeof i === "string"){
            return ObjectId(i);
        }

        else if(i instanceof ObjectId) {
            return i;
        }

        else if(i instanceof Object) {
            return "_id" in i ? ObjectId(i._id) : null;
        }

        return null;
    }
};