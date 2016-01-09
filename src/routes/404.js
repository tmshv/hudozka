/**
 * Created by tmshv on 01/03/15.
 */

var route = require("koa-route");
var router = require("./");

module.exports = function (app) {
    app.use(function *(next) {
        yield next;

        if (404 != this.status) return;

        this.status = 404;
        yield router.accepts({
            "text/html": router.index(),

            "text/plain": function *() {
                this.type = "text/plain";
                this.body = "Page not found";
            },

            "application/json": function *() {
                this.type = "application/json";
                this.body = {
                    message: "Not Found"
                };
            }
        });
    });
};