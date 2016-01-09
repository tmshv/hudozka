/**
 * Created by tmshv on 22/11/14.
 */

var APINews = require("./news");
var APIGallery = require("./gallery");

module.exports = function(app) {
    var minute = 1000 * 60;

    app.factory("api", function ($http) {
        var api = {};
        api.news = new APINews($http);
        api.gallery = new APIGallery($http, minute);

        return api;
    });
};