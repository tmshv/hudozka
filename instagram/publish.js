/**
 * Created by tmshv on 10/03/15.
 */

var co = require("co");
var instagram = require("./instagram");
var config = require("../config");
var db = require("../core/db");


module.exports = function () {
    return co(function *() {
        instagram.on("update", function (data) {
            var tag = config["tag"];

            co(function *() {
                var user = yield instagram.getUser();
                if (user) {
                    var client = instagram.client(user.code);
                    var permitted_users = yield instagram.getUsers();
                    permitted_users = permitted_users.map(function (user) {
                        return user["username"];
                    });

                    var medias = yield fbt(client, tag);
                    medias = medias.filter(function (gram) {
                        return permitted_users.indexOf(gram.data.author) > -1;
                    });

                    return medias;
                }
            })
                .then(function (posts) {
                    return posts.map(function (g) {
                        console.log(g);
                        return db.c("posts").update({"data.id": g.data.id}, g, {upsert: true})
                            .catch(function (error) {
                                console.log(error);
                            });
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    });
};

function *fbt(client, tag) {
    var param = yield instagram.api.tagMediaRecent(client, tag, 10);
    return param.medias.map(toInstagram);
}

function toInstagram(gram) {
    var post = {};

    post.body = gram.caption.text;
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
