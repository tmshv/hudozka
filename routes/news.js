/**
 * Created by tmshv on 22/11/14.
 */

var route = require("koa-route");
var router = require("./");
var db = require("../core/db");

module.exports = function (app) {
    app.use(route.get("/news", router.accepts({
        "text/html": function *() {
            this.redirect("/");
        },
        "text/plain": function *() {
            this.redirect("/");
        },
        "application/json": function *() {
            var count = parseInt(this.query["count"]) || 10;
            var portion = parseInt(this.query["portion"]) || 0;
            var skip = portion * count;

            var query = {};
            if (this.query.type) query.type = this.query.type;

            var pinned = [];
            if(portion == 0) {
                var now = new Date();
                pinned = yield db.c("posts").find({until: {$gte: now}}).toArray()
                    .then(function (items) {
                        return items.sort(sortNewsByDate);
                    });
            }
            var pinned_ids = pinned.map(function (p) {
                return p["_id"]+"";
            });

            var posts = yield db.c("posts").find(query).skip(skip).limit(count).toArray()
                .then(function (items) {
                    return items.sort(sortNewsByDate);
                })
                .then(function (items) {
                    return items.filter(function (i) {
                        var id = i["_id"]+"";
                        return pinned_ids.indexOf(id) < 0;
                    });
                });

            this.body = pinned.concat(posts);
            //this.body = pinned_ids
        }
    })));

    app.use(route.get("/news/pinned", router.accepts({
        "text/html": function *() {
            this.redirect("/");
        },
        "text/plain": function *() {
            this.redirect("/");
        },
        "application/json": function *() {
            var now = new Date();
            var pinned = yield db.c("posts").find({until: {$gte: now}}).toArray()
                .then(function (items) {
                    return items.sort(sortNewsByDate);
                });
            this.body = pinned;
        }
    })));

    app.use(route.get("/news/:uri", router.accepts({
        "text/html": router.index(),
        "text/plain": router.index(),
        "application/json": function *(uri) {
            var item = yield db.c("posts").findOne({uri: uri});
            if (item) {
                this.body = item;
            } else {
                this.status = 404;
            }
        }
    })));
};

function sortNewsByDate(i1, i2) {
    var t1 = new Date(i1.date).getTime();
    var t2 = new Date(i2.date).getTime();

    if (t1 < t2) return 1;
    if (t1 > t2) return -1;
    return 0;
}