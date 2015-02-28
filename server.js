var express = require("express");
var path = require("path");

var Promise = require("promise");
var methodOverride = require("method-override");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var app = express();
app.use("/bower_components", express.static(path.join(__dirname, "bower_components")));
app.use("/views", express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));

app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());

require("./api/feed")(app);
require("./routers/instagram")(app);

app.get("/document/*", function (req, res) {
	res.sendFile(path.join(__dirname, "views/document.html"));
});

app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "views/index.html"));
});

module.exports = function (port) {
	app.listen(port);
};
