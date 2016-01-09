var path = require("path");

var koa = require("koa.io");
var route = require("koa-route");
var serve = require("koa-static");
var logger = require("koa-logger");
var conditional = require("koa-conditional-get");
var etag = require("koa-etag");
var prerender = require("koa-prerender");
var helmet = require("koa-helmet");
var bodyParser = require("koa-bodyparser");

var config = require("./config");
var routes = require("./routes");

var app = koa();
app.proxy = true;

app.use(bodyParser());
app.use(logger());
app.use(conditional());
app.use(etag());

app.use(function *(next) {
    yield* next;

    try{
        var xp = this.response.header['x-prerender'] == 'true';
        if(xp) this.body = this.body.replace('<meta name="fragment" content="!">', '');
    }catch(e){}
});
app.use(prerender(config.prerender));

app.use(serve(path.join(__dirname, '../public')));
app.use(serve(path.join(__dirname, "templates")));

app.use(helmet());

app.use(function *(next) {
    var q = this.query;
    this.query = Object.keys(q)
        .reduce(function (q, key) {
            var v = q[key];
            if (v === "true") {
                v = true;
            } else if (v === "false") {
                v = false;
            }
            q[key] = v;
            return q;
        }, q);

    yield next;
});

app.use(route.get("/", routes.index()));
app.use(route.get("/team", routes.index()));
app.use(route.get("/docs", routes.index()));

app.use(route.get("/document/:doc", routes.index(
    path.join(__dirname, "templates/document.html")
)));

require("./routes/sitemap")(app);

require("./routes/schedule")(app);
require("./routes/news")(app);
require("./routes/gallery")(app);

require("./instagram/router")(app);
require("./instagram/io")(app);

require("./routes/404")(app);

module.exports = function (port) {
    return app;
};
