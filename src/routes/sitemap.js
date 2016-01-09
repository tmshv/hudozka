/**
 * Created by tmshv on 22/11/14.
 */

var co = require("co");
var sitemap = require("sitemap");
var route = require("koa-route");
var router = require("./");
var db = require("../core/db");

module.exports = function (app) {
    app.use(route.get("/sitemap.xml", function *() {
        var urls = yield [menu(), gallery()];
        urls = urls.reduce(function (urls, i) {
            return urls.concat(i);
        });

        var sm = sitemap.createSitemap({
            hostname: 'http://art.shlisselburg.org',
            cacheTime: 600000, // 600 sec - cache purge period
            urls: urls
        });

        var data = yield new Promise(function (resolve) {
            sm.toXML(resolve);
        });

        this.set('Content-Type', 'application/xml');
        this.body = data;
    }));
};

function *menu(){
    return require('../models/menu.json')
        .filter(function(item){
            return 'url' in item
        })
        .map(function (item) {
            return {
                url: item.url,
                changefreq: 'daily'
            }
        });
}

function *gallery(){
    var albums = yield db.c("albums")
        .find({})
        .toArray();

    return albums.map(function (album) {
        return {
            url: `/gallery/${album.date.getFullYear()}${album.course_uri}${album.uri}`,
            changefreq: 'monthly'
        }
    });
}
