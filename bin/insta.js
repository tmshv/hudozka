/**
 * Created by tmshv on 22/11/14.
 */

var config = require("../config");
var db = require("../core/db");
var instagram = require("../core/instagram");
var express = require("express");
var Promise = require("promise");
var methodOverride = require("method-override");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var Post = require("../schema/post");

db.init(config.db)
    .then(function () {
        server(config.port);
    });

function server(port) {
    var app = express();
    app.use(logger("dev"));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(methodOverride());

    require("../routers/instagram")(app);

    var Router = express.Router;
    var instagram = require("../core/instagram");
    var router = new Router();
    router.route("/").get(function (req, res) {
        if ("instagram_code" in req.cookies) {
            var client = instagram.client(req.cookies["instagram_code"]);
            instagramSandbox(client, res);
        } else {
            var ig = instagram.client();
            var url = ig.get_authorization_url(config.instagram.redirect_uri, {scope: ["basic"], state: "hello"});
            res.redirect(url);
        }
    });
    app.use(router);
    app.listen(port);
}

function instagramSandbox(ig, res) {
//    //{"username":"mlazareffa","bio":"","website":"","profile_picture":"http://images.ak.instagram.com/profiles/anonymousUser.jpg","full_name":"","id":"1549382451"}
//    //ig.user_search("mlazareffa", [], function(err, users, remaining, limit) {
//    //    console.log(err, users, remaining, limit);
//    //    res.json(users);
//    //});
//
//    // ig.user_media_recent("1549382451", [], function (err, medias, pagination, remaining, limit) {
//    //     console.log(err, medias, pagination, remaining, limit);
//    //     res.json(users);
//    // });
//
//    //ig.subscriptions(function(err, result, remaining, limit){
//    //    console.log(err, result, remaining, limit);
//    //    res.json(result);
//    //});
//
//    //ig.del_subscription({id: 14180526}, function (err, subscriptions, limit) {
//    //        console.log(err, subscriptions, limit);
//    //        res.json(subscriptions);
//    //});
//
//    ///* OPTIONS: { [verify_token] }
//    // ig.add_tag_subscription("hello", "http://home.tmshv.ru:1337/instagram/tag/hello", [], function(err, result, remaining, limit){
//    //    console.log(err, result, remaining, limit);
//    //    res.json(result);
//    //});

    findByTag(ig, "shlb_hudozka", 50)
        .catch(function (error) {
            console.log(error);
        })
        .then(function (params) {
            var list = params.medias;
            var pagination = params.pagination;
            var remaining = params.remaining;
            var limit = params.limit;

            var posts = list.map(function (gram) {
                //var post = new Post();
                var post = {};
                post.id = gram.id;
                post.author = gram.user["username"];
                post.publishDate = new Date(parseInt(gram["created_time"]) * 1000);
                post.data = gram;
                post.body = "";
                post.type = "instagram";

                return post;
            });

            Promise.all(posts.map(function (post) {
                return new Promise(function (resolve, reject) {
                    console.log('updating', post.id);
                    Post.update({id: post.id}, post, {upsert: true}, function (error, num) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                });
            }))
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    res.send("LOL");
                });

            //if (pagination.next) {
            //    pagination.next(mtr); // Will get second page results
            //}
        });
}

function findByTag(ig, tag, count) {
    return new Promise(function (resolve, reject) {
        ig.tag_media_recent(tag, {count: count}, function (err, medias, pagination, remaining, limit) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    medias: medias,
                    pagination: pagination,
                    remaining: remaining,
                    limit: limit
                });
            }
        });
    });
}