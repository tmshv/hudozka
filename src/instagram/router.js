var path = require("path");
var route = require("koa-route");
var router = require("../routes");
var instagram = require("../instagram/instagram");

function expire(time) {
    return time || new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
}

export default function (app) {
    app.use(function *(next) {
        let code = this.cookies.get('instagram_code');
        if (code) {
            let client = instagram.client(code);
            let user = instagram.user(code);
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
        route.get('/instagram', function *() {
            let invite = this.cookies.get('invite_code') || this.query.code;

            if(!this.instagram) {
                if(invite == undefined){
                    this.body = 'invite required';
                    this.status = 401;
                }else if(invite == 'LOL'){
                    this.cookies.set('invite_code', invite, {expires: expire()});

                    //todo: invalidate invite

                    yield router.index(
                        path.join(__dirname, '../templates/instagram.html')
                    );
                }else{
                    this.body = 'invite ist correct';
                    this.status = 401;
                }
            }else{
                yield router.index(
                    path.join(__dirname, '../templates/instagram.html')
                );
            }
        })
    );

    app.use(
        route.get("/instagram/auth", function *() {
            let invite = this.cookies.get('invite_code');
            if(invite) {
                let url = instagram.authorizationURL(null, '/instagram');
                this.redirect(url);
            }else{
                this.status = 401;
                this.body = 'invite required';
            }
        })
    );

    app.use(
        route.get('/instagram/user', function *() {
            let code = this.cookies.get('instagram_code');
            let user = instagram.user(code);

            if(user) {
                this.body = user;
            }else{
                this.status = 404;
            }
        })
    );

    app.use(
        route.get('/instagram/auth/callback', function *() {
            let state = this.query.state || '/';
            let code = this.query.code;

            let client;
            try {
                client = yield instagram.authorize(code);
            } catch (e) {
                client = null;
            }

            if (client) {
                this.cookies.set('instagram_code', code, {expires: expire()});
                this.redirect(state);
            } else {
                this.status = 401;
                this.redirect(state);
            }
        })
    );

    app.use(route.get('/instagram/subscription/list', function *() {
        let result = yield instagram.api.subscriptions();
        if(result) {
            this.body = result;
        }else{
            this.status = 500;
        }
    }));

    app.use(route.get('/instagram/subscription/add', function *() {
        let tag = this.query.tag;
        let cu = this.query.url;

        var result = yield instagram.api.subscribe(tag, cu);
        if(result) {
            this.body = result;
        }else{
            this.status = 500;
        }
    }));

    app.use(route.get('/instagram/subscription/delete', function *() {
        let id = this.query.id;

        var result = yield instagram.api.unsubscribe(id);
        if(result) {
            this.body = result;
        }else{
            this.status = 500;
        }
    }));

    app.use(route.get('/instagram/callback/:rnd', function *() {
        if(this.query['hub.mode'] == 'subscribe'){
            this.body = this.query['hub.challenge'];
        }else{
            this.status = 400;
        }
    }));

    app.use(route.post('/instagram/callback/:rnd', function *(rnd) {
        let sign = this.header['x-hub-signature'];
        //console.log(this.headers);

        let body = this.request.body;

        //var hmac = crypto.createHmac("sha1", instagram.client_secret);
        //hmac.update(body);
        //var shasum = hmac.digest("hex");


        //console.log("X-Hub-Signature", sign);
        //console.log("Hmac", shasum);
        //console.log();

        //if(shasum.digest("hex") == sign) {
        instagram.update(body);
        //}

        this.body = '';
    }));
};
