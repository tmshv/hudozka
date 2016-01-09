/**
 * Created by tmshv on 14/03/15.
 */

var publisher = require("./publish");

module.exports = function (app) {
    app.io.use(function *(next) {
        publisher.on("post", function (post) {
            console.log("IO POST", post);
            app.io.emit("post", post);
        });

        yield* next;
    });
};