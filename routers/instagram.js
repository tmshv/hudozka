/**
 * Created by tmshv on 22/11/14.
 */

var Router = require("express").Router;
var instagram = require("./instagram");

module.exports = function (app) {
    var router;
    router = new Router();
    router.route("/auth/instagram/callback")
        .get(function (req, res) {
            var api = instagram.client();

            var code = req.query.code;
            instagram.authorize(code)
                .catch(function(error){
                    console.log(error.body);
                    res.status(500).send('');
                })
                .then(function (client) {
                    res.cookie("instagram_code", code);
                    res.redirect("/");
                });
        });
    app.use(router);

    //http://your-callback.com/url/?hub.mode=subscribe&hub.challenge=15f7d1a91c1f40f8a748fd134752feb3&hub.verify_token=myVerifyToken
    router = new Router();
    router.route("/instagram/tag/:tag")
        .get(function (req, res) {
            var hub_challenge = req.query["hub.challenge"];
            //var hub_verify_token = req.query["hub.verify_token"];

            console.log("real time get", req.param("tag"), hub_challenge);
            res.send(hub_challenge);
        })
        .post(function (req, res) {
            console.log("real time tag", req.param("tag"));
            console.log(req.body);
            res.send("");
        });
    app.use(router);
};