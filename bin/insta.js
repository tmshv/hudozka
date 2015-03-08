/**
 * Created by tmshv on 22/11/14.
 */

var thunkify = require("thunkify");

var koa = require("koa");
var route = require("koa-route");
var logger = require("koa-logger");

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

    var instagram = require("../core/instagram");

    app.use(
        route.get("/", function *() {
            if ("instagram_code" in this.cookies) {
                var client = instagram.client(this.cookies["instagram_code"]);

                yield instagramSandbox(client);
            } else {
                var ig = instagram.client();
                var url = ig["get_authorization_url"](config.instagram.redirect_uri, {
                    scope: ["basic"],
                    state: "hello"
                });
                this.redirect(url);
            }
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
            instagram.authorize(code)
                .catch(function (error) {
                    console.log(error.body);
                    this.status = 500;
                })
                .then(function (client) {
                    this.cookie("instagram_code", code);
                    this.redirect("/");
                });
        })
    );

    app.listen(port);
}

function instagramSandbox(ig) {

    function *user_search() {
        var user_search = thunkify(ig["user_search"]);
        var s = yield user_search("hudozka");
        this.body = s[0];
    }

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

    function *fbt() {
        var param = yield findByTag(ig, "shlb_hudozka", 50);

        var grams = param.medias.map(toInstagram);
        var ids = grams.map(function (g) {
            return g.data.id;
        });

        yield grams.map(function (g) {
            return db.c("posts").update({"data.id": g.data.id}, g, {upsert: true});
        });

        this.body = yield db.c("posts").find({"data.id": {$in: ids}}).toArray();
    }

    return fbt;
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
