/**
 * Created by tmshv on 10/03/15.
 */

var co = require("co");
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var instagram = require("./instagram");
var config = require("../config");
var db = require("../core/db");

function Publisher() {
    EventEmitter.call(this);

    var self = this;
    instagram.on("update", function (data) {
        var tag = config.instagram["tags"][0];

        findInstagrams(tag)
            .catch(function (error) {
                console.log(error);
            })
            .then(function (posts) {
                var ids = posts.map(function (gram) {
                    return gram.data.id;
                });

                return uploadInstagrams(posts)
                    .then(function () {
                        return db.c("posts").find({"data.id": {$in: ids}}).toArray();
                    });
            })
            .then(function (posts) {
                self.emit("post", posts);
            });
    });
}

util.inherits(Publisher, EventEmitter);

module.exports = new Publisher();

function *fbt(client, tag) {
    var param = yield instagram.api.tagMediaRecent(client, tag, 10);
    return param.medias.map(toInstagram);
}

function toInstagram(gram) {
    var post = {};

    try {
        post.body = gram.caption.text;
    } catch (error) {
        post.body = "";
    }

    post.type = "instagram";
    post.tags = gram.tags;
    post.date = new Date(parseInt(gram["created_time"]) * 1000);

    post.data = {
        id: gram.id,
        author: gram.user["username"],
        image: gram.images,
        url: gram.link
    };

    return post;
}

function findInstagrams(tag){
    return co(function *() {
        var user = yield instagram.getUser();
        if (user) {
            var client = instagram.client(user.code);
            var permitted_users = yield instagram.getUsers();
            permitted_users = permitted_users.map(function (user) {
                return user["username"];
            });

            var medias = yield fbt(client, tag);
            //medias = medias.filter(function (gram) {
            //    return permitted_users.indexOf(gram.data.author) > -1;
            //});

            return medias;
        }
    });
}

function uploadInstagrams(list){
    return Promise.all(
        list.map(function (g) {
            return db.c("posts").update({"data.id": g.data.id}, g, {upsert: true});
        })
    );
}