/**
 * Created by tmshv on 22/11/14.
 */

module.exports = function(app) {
    app.factory("api", function ($http) {
        var api = {};
        var Endpoint = require("./feed");
        api.feed = new Endpoint($http);

        return api;
    });
};