/**
 * Created by tmshv on 22/11/14.
 */

var co = require("co");
var route = require("koa-route");
var router = require("./");
var db = require("../core/db");

module.exports = function (app) {
    app.use(route.get("/gallery", router.accepts({
        "text/html": router.index(),
        "text/plain": router.index(),
        "application/json": function *() {
            var query = {};
            var albums = yield db.c("albums")
                .find(query)
                .toArray();

            albums = yield albums.map(processAlbum);
            this.body = albums;
        }
    })));

    app.use(route.get("/gallery/:year", router.accepts({
        "text/html": router.index(),
        "text/plain": router.index(),
        "application/json": function *(year) {
            year = parseInt(year);
            var start = new Date(year, 0, 1);
            var end = new Date(year, 11, 31);
            var query = {
                date: {$gte: start, $lt: end}
            };
            var albums = yield db.c("albums")
                .find(query)
                .toArray();

            albums = yield albums.map(processAlbum);
            this.body = albums;
        }
    })));

    app.use(route.get("/album/:year/:course/:album", router.accepts({
        "text/html": router.index(),
        "text/plain": router.index(),
        "application/json": function *(year, course, album) {
            year = parseInt(year);
            course = '/' + course;
            album = '/' + album;
            var start = new Date(year, 0, 1);
            var end = new Date(year, 11, 31);
            var query = {
                date: {$gte: start, $lt: end},
                course_uri: course,
                uri: album
            };

            var a = yield db.c("albums").findOne(query);
            a = yield processAlbum(a);
            this.body = a;
        }
    })));
};

function processAlbum(album) {
    return co(function *() {
        album.url = '/album/{year}{course}{album}'
            .replace('{year}', album.date.getFullYear())
            .replace('{course}', album.course_uri)
            .replace('{album}', album.uri);

        album.content = yield album.content.map(function (product_id) {
            return co(function *() {
                var product = yield db.c("products").findOne({_id: product_id});
                if (product) return product;
                else return null;
            });
        });

        return album;
    });
}