/**
 * Created by tmshv on 22/11/14.
 */

var path = require("path");
var route = require("koa-route");
var router = require("../routes");
var instagram = require("../instagram/instagram");

module.exports = function (app) {
    app.use(function *(next) {
        var code = this.cookies.get("instagram_code");
        if (code) {
            var client = instagram.client(code);
            var user = instagram.user(code);
            if (client && user) {
                this.instagram = {
                    client: client,
                    user: user
                }
            }
        }

        yield* next;
    });

    app.use(
        route.get("/instagram", function *() {
            var invite = this.cookies.get("invite_code") || this.query.code;

            if(!this.instagram) {
                if(invite == undefined){
                    this.body = "invite required";
                    this.status = 401;
                }else if(invite == "LOL"){
                    this.cookies.set("invite_code", invite, {expires: expire()});

                    //todo: invalidate invite

                    yield router.index(
                        path.join(__dirname, "../templates/instagram.html")
                    );
                }else{
                    this.body = "invite ist correct";
                    this.status = 401;
                }
            }else{
                yield router.index(
                    path.join(__dirname, "../templates/instagram.html")
                );
            }
        })
    );

    app.use(
        route.get("/instagram/auth", function *() {
            var invite = this.cookies.get("invite_code");
            if(invite) {
                var url = instagram.authorizationURL(null, "/instagram");
                this.redirect(url);
            }else{
                this.status = 401;
                this.body = "invite required";
            }
        })
    );

    app.use(
        route.get("/instagram/user", function *() {
            var code = this.cookies.get("instagram_code");
            var user = instagram.user(code);

            if(user) {
                this.body = user;
            }else{
                this.status = 404;
            }
        })
    );

    app.use(
        route.get("/instagram/auth/callback", function *() {
            var state = this.query.state || "/";
            var code = this.query.code;
            var client = yield instagram.authorize(code);

            if (client) {
                this.cookies.set("instagram_code", code, {expires: expire()});
                this.redirect(state);
            } else {
                this.status = 401;
                this.redirect(state);
            }
        })
    );

    app.use(route.get("/instagram/subscription/list", function *() {
        var result = yield instagram.api.subscriptions();
        if(result) {
            this.body = result;
        }else{
            this.status = 500;
        }
    }));

    app.use(route.get("/instagram/subscription/add", function *() {
        var tag = this.query.tag;
        var cu = this.query.url;

        var result = yield instagram.api.subscribe(tag, cu);
        if(result) {
            this.body = result;
        }else{
            this.status = 500;
        }
    }));

    app.use(route.get("/instagram/subscription/delete", function *() {
        var id = this.query.id;

        var result = yield instagram.api.unsubscribe(id);
        if(result) {
            this.body = result;
        }else{
            this.status = 500;
        }
    }));

    app.use(route.get("/instagram/callback/:rnd", function *() {
        if(this.query["hub.mode"] == "subscribe"){
            this.body = this.query["hub.challenge"];
        }else{
            this.status = 400;
        }
    }));

    app.use(route.post("/instagram/callback/:rnd", function *(rnd) {
        var sign = this.header["x-hub-signature"];
        //console.log(this.headers);

        var body = this.request.body;

        //var hmac = crypto.createHmac("sha1", instagram.client_secret);
        //hmac.update(body);
        //var shasum = hmac.digest("hex");


        //console.log("X-Hub-Signature", sign);
        //console.log("Hmac", shasum);
        //console.log();

        //if(shasum.digest("hex") == sign) {
        instagram.update(body);
        //}

        this.body = "";
    }));
};

function expire(time){
    return time || new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
}