/**
 * Created by tmshv on 22/11/14.
 */

var Router = require("express").Router;
var db = require("../core/db");

module.exports = function (app) {
    var router;
    router = new Router();
    router.route("/api/feed")
        .get(function (req, res) {
            db.c("posts").find().toArray()
                .catch(function(e){
                    res.error(e);
                })
                .then(function (docs) {
                    res.json(docs);
                });
        });
    app.use(router);
};