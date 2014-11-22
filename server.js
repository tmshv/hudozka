var express = require("express");
var path = require("path");
var config = require("./config");

var server = express();
server.use("/bower_components", express.static(path.join(__dirname, "bower_components")));
server.use("/views", express.static(path.join(__dirname, "views")));
server.use(express.static(path.join(__dirname, "public")));

server.get("/document/*", function (req, res) {
	res.sendFile(path.join(__dirname, "views/document.html"));
});

server.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "views/index.html"));
});

server.listen(config.port);
