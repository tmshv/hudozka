/**
 * Created by tmshv on 12/03/15.
 */

var db = require("../core/db");
var co = require("co");
var instagram = require("./instagram");
var publish = require("./publish");
var config = require("../config");

module.exports = function () {
    return loadUsers()
        .then(publish)
        .then(updateSubscription)
};

function loadUsers() {
    return new Promise(function (resolve, reject) {
        db.c("users").find({provider: "instagram"})
            .toArray()
            .then(function (users) {
                users.forEach(function (u) {
                    return instagram.initUser(u);
                });
                return users;
            })
            .then(resolve);
    });
}

function updateSubscription() {
    var tags = [config["tag"]];
    return tags.map(function (tag) {
        var cb = config.instagram["tag_callback"];
        return co(function *() {
            return yield instagram.api.subscribe(tag, cb);
        })
    });
}