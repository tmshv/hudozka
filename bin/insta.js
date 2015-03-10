/**
 * Created by tmshv on 22/11/14.
 */

var thunkify = require("thunkify");

var koa = require("koa");
var route = require("koa-route");
var logger = require("koa-logger");
var bodyParser = require("koa-bodyparser");

var config = require("../config");
var db = require("../core/db");
var instagram = require("../core/instagram");

db.init(config.db.uri)
    .then(function () {
        server(config.port);
    });

function server(port) {
    var app = koa();
    app.proxy = true;
    app.use(logger());
    app.use(bodyParser());

    var instagram = require("../core/instagram");

    app.use(function *(next) {
        var code = this.cookies.get("instagram_code");
        if (code) {
            var client = instagram.client(code);
            var user = instagram.user(code);
            if (client && user) {
                this.instagram = {
                    client: client,
                    user: user
                }
            }
        }

        yield* next;
    });

    app.use(
        route.get("/", function *() {
            if (this.instagram) {
                yield instagramSandbox(this.instagram, this.query);
            } else {
                var client = instagram.client();
                var url = client["get_authorization_url"](config.instagram.redirect_uri, {
                    scope: ["basic"],
                    state: "hello"
                });
                this.redirect(url);
            }

            //var code = this.cookies.get("instagram_code");
            //if (code) {
            //    var client = instagram.client(code);
            //    yield instagramSandbox(client);
            //} else {
            //    var ig = instagram.client();
            //    var url = ig["get_authorization_url"](config.instagram.redirect_uri, {
            //        scope: ["basic"],
            //        state: "hello"
            //    });
            //    this.redirect(url);
            //}
        })
    );

    app.use(
        route.get("/i", function *() {
            var code = "6b95d605c82444c98f77de1f304b2a8e";
            var client = instagram.client(code);

            yield instagramSandbox(client);
        })
    );

    app.use(
        route.get("/old-to-new", function *() {
            var grams = yield db.c("posts").find({
                "author": {$exists: true},
                "id": {$exists: true},
                "type": "instagram"
            }).toArray();

            var ids = grams.map(function (g) {
                return g.id;
            });

            grams = grams.map(function (g) {
                return g.data;
            });
            grams = grams.map(toInstagram);

            yield db.c("grams").remove({"id": {$in: ids}});
            yield grams.map(function (g) {
                return db.c("posts").update({"data.id": g.data.id}, g, {upsert: true});
            });

            this.body = yield db.c("grams").find({"data.id": {$in: ids}}).toArray();
        })
    );

    app.use(
        route.get("/auth/instagram/callback", function *() {
            var code = this.query.code;
            var client = yield instagram.authorize(code);

            //.catch(function (error) {
            //    console.log(error.body);
            //    this.status = 500;
            //})
            //.then(function (client) {
            //    this.cookie("instagram_code", code);
            //    this.redirect("/");
            //});
            if (client) {
                this.cookies.set("instagram_code", code);
                this.redirect("/");
            } else {
                this.status = 401;
                this.redirect("/");
            }
        })
    );

    app.use(route.get("/instagram/subscription", function *() {
        var hub_challenge = this.query["hub.challenge"];
        //var hub_verify_token = req.query["hub.verify_token"];
        console.log("real time get", hub_challenge);
        this.body = hub_challenge;
    }));

    app.use(route.post("/instagram/subscription", function *() {
        console.log("real time:");
        console.log(this.request.body);
        this.body = "";

        //[ { changed_aspect: 'media',
        //    object: 'tag',
        //    object_id: 'testing',
        //    time: 1425951815,
        //    subscription_id: 17157947,
        //    data: {} } ]
    }));

    app.listen(port);
}

function instagramSandbox(gram, params) {
    var ig = gram.client;
    var current_user = gram.user;

    var methods = {
        user_search: function (user) {
            return function *() {
                var user_search = thunkify(ig["user_search"]);
                var s = yield user_search(user);
                this.body = s[0];
            }
        },

        user: function (id) {
            return function *() {
                var user = thunkify(ig["user"]);
                try {
                    var s = yield user(id);
                    this.body = s[0];
                } catch (error) {
                    this.status = 500;
                    this.body = error;
                }
            }
        },

        findByTag: function(tag) {
            return function *() {
                var param = yield findByTag(ig, tag, 50);

                var grams = param.medias.map(toInstagram);
                var ids = grams.map(function (g) {
                    return g.data.id;
                });

                yield grams.map(function (g) {
                    return db.c("posts").update({"data.id": g.data.id}, g, {upsert: true});
                });

                this.body = yield db.c("posts").find({"data.id": {$in: ids}}).toArray();
            }
        },

        subscriptions: function(){
            return function *(){
                var ig = instagram.client();
                var subs = thunkify(ig["subscriptions"]);
                try {
                    var s = yield subs();
                    this.body = s[0];
                } catch (error) {
                    this.status = 500;
                    this.body = error;
                }
            }
        },

        addTagSubscription: function(tag){
            return function *(){
                var ig = instagram.client();
                var sub = thunkify(ig["add_tag_subscription"]);
     //ig.add_tag_subscription("hello", "http://home.tmshv.ru:1337/instagram/tag/hello", [], function(err, result, remaining, limit){

                try {
                    var s = yield sub(tag, "https://slwjtsrtlh.localtunnel.me/instagram/subscription");
                    this.body = s[0];
                } catch (error) {
                    this.status = 500;
                    this.body = error;
                }
            }
        }
    };

//    // ig.user_media_recent("1549382451", [], function (err, medias, pagination, remaining, limit) {
//    //     console.log(err, medias, pagination, remaining, limit);
//    //     res.json(users);
//    // });
//
//    //ig.del_subscription({id: 14180526}, function (err, subscriptions, limit) {
//    //        console.log(err, subscriptions, limit);
//    //        res.json(subscriptions);
//    //});

    var method = params.method || "user";
    var value = params.value || current_user.id;
    return methods[method](value);
}

function *findByTag(ig, tag, count) {
    var tag_media_recent = thunkify(ig["tag_media_recent"]);

    var result = yield tag_media_recent(tag, {count: count});
    return {
        medias: result[0],
        pagination: result[1],
        remaining: result[2],
        limit: result[3]
    };
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
