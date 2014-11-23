/**
 * Created by tmshv on 22/11/14.
 */

var Router = require("express").Router;
var Post = require("../schema/post");

module.exports = function (app) {
    var router;
    router = new Router();
    router.route("/api/feed")
        .get(function (req, res) {
            Post.find({}).exec(function (error, list) {
                if (error) return res.error(error);

                res.json(list.map(function (post) {
                    return post.toObject();
                }));
            });
        });
    app.use(router);
};