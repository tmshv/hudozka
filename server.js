var express = require("express");
var path = require("path");
var config = require("./config");

var pub = "./public";
// var pub = pacth.resolve("~/Dropbox/Dev/Hud school/public/");
// console.log(pub);
// console.log(pub);

var server = express();
//server.engine("jade", require("consolidate").jade);
//server.set("view engine", "jade");
//server.set("views", [__dirname, "/pages"].join(""));
server.use("/bower_components", express.static(path.join(__dirname, "bower_components")));
server.use("/views", express.static(path.join(__dirname, "views")));
server.use(express.static(path.join(__dirname, "public")));

//server.get("/", function(req, res){
//	var url = "/";
//	var route = require("./routers/route");
//	res.render("main/main", {
//		menu: route.menu(url)
//	});
//});
//
//server.use(require("./routers/schedule"));
//server.use(require("./routers/team.router").middleware);
//server.use(require("./routers/docs"));

server.get("/document/*", function (req, res) {
	res.sendFile(path.join(__dirname, "views/document.html"));
});

server.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "views/index.html"));
});

server.listen(config.port);
console.log("welcome!");
// console.log(JSON.stringify(config.data.schedule, null, "\t"));