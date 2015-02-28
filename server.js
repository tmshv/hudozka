var path = require("path");
var fs = require("mz/fs");

var koa = require("koa");
var route = require("koa-route");
var serve = require("koa-static");
var logger = require("koa-logger");
var prerender = require('koa-prerender');

var config = require("./config");

var app = koa();
app.use(logger());

app.use(prerender(config.prerender));

app.use(serve(path.join(__dirname, "public")));
app.use(serve(path.join(__dirname, "templates")));

app.use(route.get("/", index));
app.use(route.get("/schedule", index));
app.use(route.get("/team", index));
app.use(route.get("/docs", index));

app.use(route.get("/document/:doc", document));

function *index(){
	var fn = path.join(__dirname, "templates/index.html");
	this.type = "text/html";
	this.body = fs.createReadStream(fn);
}

function *document(){
	var fn = path.join(__dirname, "templates/document.html");
	this.type = "text/html";
	this.body = fs.createReadStream(fn);
}

require("./api/feed")(app);

module.exports = function (port) {
	app.listen(port);
};
