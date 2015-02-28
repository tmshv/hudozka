/**
 * Created by tmshv on 22/11/14.
 */

var route = require("koa-route");
var db = require("../core/db");

module.exports = function (app) {
    app.use(route.get("/api/feed", function *(){
        this.body = yield db.c("posts").find().toArray();
    }));
};